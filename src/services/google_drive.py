"""
Google Drive Service for file upload and management
"""
import os
import json
import uuid
import requests
from urllib.parse import urlencode
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


def _drive_config_available():
    """Check if Google Drive credentials are configured"""
    access_token = getattr(settings, 'GOOGLE_ACCESS_TOKEN', None) or os.getenv('GOOGLE_ACCESS_TOKEN')
    refresh_token = getattr(settings, 'GOOGLE_REFRESH_TOKEN', None) or os.getenv('GOOGLE_REFRESH_TOKEN')
    client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None) or os.getenv('GOOGLE_CLIENT_ID')
    return bool(access_token or (refresh_token and client_id))


class GoogleDriveService:
    def __init__(self):
        self.client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None)
        self.client_secret = getattr(settings, 'GOOGLE_CLIENT_SECRET', None)
        self.redirect_uri = getattr(settings, 'GOOGLE_REDIRECT_URI', None)
        self.scopes = [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.readonly'
        ]
        
        # Don't raise error here, let individual methods handle missing credentials
    
    def get_auth_url(self):
        """Generate Google OAuth authorization URL"""
        if not all([self.client_id, self.client_secret, self.redirect_uri]):
            raise Exception("Google Drive credentials not configured")
        
        auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
        params = {
            'client_id': self.client_id,
            'redirect_uri': self.redirect_uri,
            'scope': ' '.join(self.scopes),
            'response_type': 'code',
            'access_type': 'offline',
            'prompt': 'consent'
        }

        query_string = urlencode(params)
        return f"{auth_url}?{query_string}"
    
    def exchange_code_for_tokens(self, code):
        """Exchange authorization code for access and refresh tokens"""
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': self.redirect_uri
        }
        
        response = requests.post(token_url, data=data)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Token exchange failed: {response.text}")
    
    def refresh_access_token(self, refresh_token):
        """Refresh access token using refresh token"""
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'refresh_token': refresh_token,
            'grant_type': 'refresh_token'
        }
        
        response = requests.post(token_url, data=data)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Token refresh failed: {response.text}")
    
    def create_folder_structure(self, folder_name, parent_folder_id=None):
        """Create a folder in Google Drive"""
        access_token = self._get_valid_access_token()
        
        if not access_token:
            raise Exception("No valid access token available")
        
        # Check if folder already exists
        query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder'"
        if parent_folder_id:
            query += f" and '{parent_folder_id}' in parents"
        
        # Search for existing folder
        search_url = f"https://www.googleapis.com/drive/v3/files?q={query}&fields=files(id,name)"
        headers = {'Authorization': f'Bearer {access_token}'}
        
        response = requests.get(search_url, headers=headers)
        if response.status_code == 200:
            files = response.json().get('files', [])
            if files:
                return files[0]['id']  # Return existing folder ID
        
        # Create new folder
        metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder',
            'parents': [parent_folder_id] if parent_folder_id else []
        }
        
        create_url = "https://www.googleapis.com/drive/v3/files"
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(create_url, json=metadata, headers=headers)
        
        if response.status_code == 200:
            folder_data = response.json()
            return folder_data['id']
        else:
            raise Exception(f"Folder creation failed: {response.text}")

    def upload_file_to_drive(self, file_obj, file_name, folder_id=None):
        """Upload file to Google Drive"""
        # Get access token (you might want to store this in session or database)
        access_token = self._get_valid_access_token()
        
        if not access_token:
            raise Exception("No valid access token available")
        
        # Prepare metadata
        metadata = {
            'name': file_name,
            'parents': [folder_id] if folder_id else []
        }
        
        # Upload file
        upload_url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
        
        # Create multipart data
        metadata_json = json.dumps(metadata)
        
        files = {
            'metadata': (None, metadata_json, 'application/json'),
            'file': (file_name, file_obj, 'application/octet-stream')
        }
        
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        
        response = requests.post(upload_url, files=files, headers=headers)
        
        if response.status_code == 200:
            file_data = response.json()
            
            # Make file publicly viewable
            shareable_link = self._make_file_public(file_data['id'], access_token)
            
            return {
                'file_id': file_data['id'],
                'name': file_data['name'],
                'size': file_data.get('size', 0),
                'mime_type': file_data.get('mimeType', ''),
                'shareable_link': shareable_link,
                'web_view_link': file_data.get('webViewLink', ''),
                'web_content_link': file_data.get('webContentLink', '')
            }
        else:
            raise Exception(f"File upload failed: {response.text}")

    def get_or_create_company_folder(self, company_name):
        """Get or create company folder structure"""
        # Create main folder structure: starzed_files/company_documents/[company_name]
        main_folder_id = self.create_folder_structure('starzed_files')
        company_docs_folder_id = self.create_folder_structure('company_documents', main_folder_id)
        company_folder_id = self.create_folder_structure(self._sanitize_folder_name(company_name), company_docs_folder_id)
        
        return company_folder_id

    def get_or_create_client_folder(self, client_name):
        """Get or create client folder structure"""
        # Create main folder structure: starzed_files/client_documents/[client_name]
        main_folder_id = self.create_folder_structure('starzed_files')
        client_docs_folder_id = self.create_folder_structure('client_documents', main_folder_id)
        client_folder_id = self.create_folder_structure(self._sanitize_folder_name(client_name), client_docs_folder_id)
        
        return client_folder_id

    def _sanitize_folder_name(self, name):
        """Sanitize folder name for Google Drive"""
        # Remove invalid characters and replace spaces with underscores
        import re
        sanitized = re.sub(r'[<>:"/\\|?*]', '', name)
        sanitized = re.sub(r'\s+', '_', sanitized)
        return sanitized[:100]  # Limit to 100 characters
    
    def _make_file_public(self, file_id, access_token):
        """Make file publicly viewable and return shareable link"""
        # Set file permissions to public
        permissions_url = f"https://www.googleapis.com/drive/v3/files/{file_id}/permissions"
        permission_data = {
            'role': 'reader',
            'type': 'anyone'
        }
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(permissions_url, json=permission_data, headers=headers)
        
        if response.status_code == 200:
            # Return public shareable link
            return f"https://drive.google.com/file/d/{file_id}/view"
        else:
            raise Exception(f"Failed to make file public: {response.text}")
    
    def _get_valid_access_token(self):
        """Get valid access token (refresh if needed)"""
        access_token = getattr(settings, 'GOOGLE_ACCESS_TOKEN', None) or os.getenv('GOOGLE_ACCESS_TOKEN')
        if access_token:
            return access_token

        refresh_token = getattr(settings, 'GOOGLE_REFRESH_TOKEN', None) or os.getenv('GOOGLE_REFRESH_TOKEN')
        if not refresh_token:
            return None

        if not all([self.client_id, self.client_secret]):
            return None

        tokens = self.refresh_access_token(refresh_token)
        return tokens.get('access_token')


def upload_file_to_google_drive(file_obj, file_name, company_id=None, company_name=None, client_id=None, client_name=None, description=""):
    """
    Convenience function to upload file to Google Drive and save to database.
    Falls back to local file storage when Google Drive credentials are not configured.
    """
    drive_available = _drive_config_available()
    temp_id = str(uuid.uuid4())  # Unique placeholder to avoid unique constraint issues

    try:
        if drive_available:
            drive_service = GoogleDriveService()

            # Determine folder structure based on whether it's company or client document
            if company_id and company_name:
                folder_id = drive_service.get_or_create_company_folder(company_name)
            elif client_id and client_name:
                folder_id = drive_service.get_or_create_client_folder(client_name)
            else:
                folder_id = None
        else:
            folder_id = None

        # Create the database record with a unique temp placeholder
        if company_id and company_name:
            from companies.models import CompanyDocument
            document = CompanyDocument.objects.create(
                company_id=company_id,
                file_name=file_name,
                file_size=file_obj.size if hasattr(file_obj, 'size') else 0,
                mime_type=getattr(file_obj, 'content_type', '') or '',
                google_drive_file_id=temp_id,
                google_drive_url='',
                description=description
            )
        elif client_id and client_name:
            from clients.models import ClientDocument
            document = ClientDocument.objects.create(
                client_id=client_id,
                file_name=file_name,
                file_size=file_obj.size if hasattr(file_obj, 'size') else 0,
                mime_type=getattr(file_obj, 'content_type', '') or '',
                google_drive_file_id=temp_id,
                google_drive_url='',
                description=description
            )

        if drive_available:
            # Upload to Google Drive
            drive_result = drive_service.upload_file_to_drive(file_obj, file_name, folder_id)

            # Update database record with Drive information
            document.file_size = drive_result['size']
            document.mime_type = drive_result['mime_type']
            document.google_drive_file_id = drive_result['file_id']
            document.google_drive_url = drive_result['shareable_link']
            document.save()

            return {
                'success': True,
                'message': 'File uploaded successfully to Google Drive',
                'data': {
                    'id': str(document.id),
                    'file_name': file_name,
                    'file_size': drive_result['size'],
                    'google_drive_url': drive_result['shareable_link'],
                    'google_drive_file_id': drive_result['file_id'],
                    'folder_path': f"starzed_files/company_documents/{drive_service._sanitize_folder_name(company_name) if company_name else 'unknown'}" if company_id else f"starzed_files/client_documents/{drive_service._sanitize_folder_name(client_name) if client_name else 'unknown'}" if client_id else "starzed_files",
                    'uploaded_at': document.uploaded_at.isoformat()
                }
            }
        else:
            # Fallback: save file locally
            local_dir = os.path.join(settings.MEDIA_ROOT, 'uploads', company_name or client_name or 'general')
            os.makedirs(local_dir, exist_ok=True)
            local_path = os.path.join(local_dir, file_name)

            # Read file content and write locally
            file_content = file_obj.read()
            with open(local_path, 'wb') as f:
                f.write(file_content)

            local_url = os.path.join(settings.MEDIA_URL, 'uploads', company_name or client_name or 'general', file_name)

            # Update document with local path
            document.google_drive_file_id = temp_id  # Keep the UUID so it's unique
            document.google_drive_url = local_url
            document.save()

            return {
                'success': True,
                'message': 'File uploaded successfully to local storage (Google Drive not configured)',
                'data': {
                    'id': str(document.id),
                    'file_name': file_name,
                    'file_size': document.file_size,
                    'google_drive_url': local_url,
                    'google_drive_file_id': temp_id,
                    'folder_path': local_dir,
                    'uploaded_at': document.uploaded_at.isoformat()
                }
            }

    except Exception as e:
        return {
            'success': False,
            'message': f'File upload failed: {str(e)}',
            'data': None
        }
