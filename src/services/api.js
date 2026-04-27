// API Service for frontend-backend communication

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || '/api';
  }

  _clearAuthAndRedirect() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
  }

  async refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this._clearAuthAndRedirect();
      return null;
    }

    let response;
    try {
      response = await this.request('/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
        skipAuth: true,
        __isRefreshRequest: true,
      });
    } catch (err) {
      // Refresh failed (expired/blacklisted token) — clear auth and redirect
      this._clearAuthAndRedirect();
      return null;
    }

    const newAccess = response?.access;
    const newRefresh = response?.refresh;

    if (newAccess) {
      localStorage.setItem('authToken', newAccess);
    }
    if (newRefresh) {
      localStorage.setItem('refreshToken', newRefresh);
    }

    if (!newAccess) {
      this._clearAuthAndRedirect();
      return null;
    }

    return newAccess;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const token = localStorage.getItem('authToken');
    
    // Don't set Content-Type for FormData (browser will set it with boundary)
    const defaultHeaders = options.body instanceof FormData 
      ? {} 
      : { 'Content-Type': 'application/json' };
    
    const config = {
      headers: {
        ...defaultHeaders,
        ...(!options.skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    try {
      let response = await fetch(url, config);

      const method = (config.method || 'GET').toUpperCase();
      if (response.status === 401 || response.status === 403) {
        // 403 on token refresh means the refresh token is expired/blacklisted
        if (response.status === 403 && options.__isRefreshRequest) {
          this._clearAuthAndRedirect();
          throw new Error('Session expired');
        }

        if (token && !options.__retryAfterRefresh && !options.__isRefreshRequest) {
          const newAccess = await this.refreshAccessToken();
          if (newAccess) {
            return this.request(endpoint, {
              ...options,
              __retryAfterRefresh: true,
            });
          }
          // refreshAccessToken already redirected to login if it failed, so just throw
          throw new Error('Session expired');
        }

        // For GET endpoints with a token, retry without auth
        // (the view may be AllowAny and work without a token)
        if (token && method === 'GET' && !options.__retryWithoutAuth && !options.__isRefreshRequest) {
          const retryOptions = {
            ...options,
            __retryWithoutAuth: true,
            skipAuth: true,
          };
          return this.request(endpoint, retryOptions);
        }
      }
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Companies API
  async getCompanies() {
    return this.request('/companies/');
  }

  // Auth API
  async login(credentials) {
    return this.request('/users/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/users/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCompany(id) {
    return this.request(`/companies/${id}/`);
  }

  async createCompany(companyData) {
    return this.request('/companies/', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }

  async updateCompany(id, companyData) {
    return this.request(`/companies/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  }

  async deleteCompany(id) {
    return this.request(`/companies/${id}/`, {
      method: 'DELETE',
    });
  }

  async bulkImportCompanies(companiesData) {
    return this.request('/companies/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ companies: companiesData }),
    });
  }

  // Clients API
  async getClients() {
    return this.request('/clients/');
  }

  async getClient(id) {
    return this.request(`/clients/${id}/`);
  }

  async createClient(clientData) {
    return this.request('/clients/', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  async updateClient(id, clientData) {
    return this.request(`/clients/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  }

  async deleteClient(id) {
    return this.request(`/clients/${id}/`, {
      method: 'DELETE',
    });
  }

  async bulkImportClients(clientsData) {
    return this.request('/clients/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ clients: clientsData }),
    });
  }

  // Posta Branches API
  async getPostaBranches() {
    return this.request('/posta-branches/');
  }

  async createPostaBranch(branchData) {
    return this.request('/posta-branches/', {
      method: 'POST',
      body: JSON.stringify(branchData),
    });
  }

  async bulkImportPostaBranches(branchesData) {
    return this.request('/posta-branches/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ branches: branchesData }),
    });
  }

  // Motor Vehicles API
  async getMotorVehicles() {
    return this.request('/motor-vehicles/');
  }

  async createMotorVehicle(vehicleData) {
    return this.request('/motor-vehicles/', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async bulkImportMotorVehicles(vehiclesData) {
    return this.request('/motor-vehicles/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ vehicles: vehiclesData }),
    });
  }

  async updateMotorVehicle(id, vehicleData) {
    return this.request(`/motor-vehicles/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteMotorVehicle(id) {
    return this.request(`/motor-vehicles/${id}/`, {
      method: 'DELETE',
    });
  }

  // Extra Premiums API
  async getExtraPremiums() {
    return this.request('/extra-premiums/');
  }

  async createExtraPremium(premiumData) {
    return this.request('/extra-premiums/', {
      method: 'POST',
      body: JSON.stringify(premiumData),
    });
  }

  async bulkImportExtraPremiums(premiumsData) {
    return this.request('/extra-premiums/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ premiums: premiumsData }),
    });
  }

  // Products API
  async getProducts() {
    return this.request('/products/');
  }

  async createProduct(productData) {
    return this.request('/products/', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}/`, {
      method: 'DELETE',
    });
  }

  async bulkImportProducts(productsData) {
    return this.request('/products/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ products: productsData }),
    });
  }

  // Insurance Types API
  async getInsuranceTypes() {
    return this.request('/insurance-types/');
  }

  async createInsuranceType(typeData) {
    return this.request('/insurance-types/', {
      method: 'POST',
      body: JSON.stringify(typeData),
    });
  }

  async bulkImportInsuranceTypes(typesData) {
    return this.request('/insurance-types/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ types: typesData }),
    });
  }

  // Claims API
  async getClaims() {
    return this.request('/claims/');
  }

  async bulkImportClaims(claimsData) {
    return this.request('/claims/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ claims: claimsData }),
    });
  }

  // Client Policies (Agent Policies table) API
  async getClientPolicies() {
    return this.request('/clients/policies/');
  }

  async bulkImportClientPolicies(policiesData) {
    return this.request('/clients/policies/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ policies: policiesData }),
    });
  }

  // Users API
  async getUsers() {
    return this.request('/admin/users/');
  }

  async toggleUserStatus(id) {
    return this.request(`/admin/users/${id}/toggle-status/`, {
      method: 'PATCH',
    });
  }

  // Blogs API
  async getBlogs() {
    return this.request('/blogs/');
  }

  async createBlog(blogData) {
    return this.request('/blogs/create/', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  }

  async updateBlog(id, blogData) {
    return this.request(`/blogs/${id}/update/`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    });
  }

  async deleteBlog(id) {
    return this.request(`/blogs/${id}/delete/`, {
      method: 'DELETE',
    });
  }

  async createUser(userData) {
    return this.request('/admin/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/admin/users/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}/`, {
      method: 'DELETE',
    });
  }

  // Clear all users
  async clearAllUsers() {
    return this.request('/admin/users/clear/', {
      method: 'DELETE',
    });
  }

  async seedDatabase() {
    return this.request('/admin/users/seed/', {
      method: 'POST',
    });
  }

  async clearDatabase() {
    try {
      const response = await this.request('/admin/users/clear/', {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      // Enhance error with more context
      console.error('Clear database API error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health/');
  }

  // General File Upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return fetch(`${this.baseURL}/upload/`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type header, let browser set it with boundary
        // for multipart/form-data
      }
    }).then(response => response.json());
  }

  // Google Drive Upload
  async uploadToGoogleDrive(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return fetch(`${this.baseURL}/upload/google-drive/`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type header, let browser set it with boundary
        // for multipart/form-data
      }
    }).then(response => response.json());
  }

  // Google Auth
  async getGoogleAuthUrl() {
    return this.request('/auth/google/url/');
  }

  async handleGoogleCallback(code, state) {
    return this.request('/auth/google/callback/', {
      method: 'POST',
      body: JSON.stringify({ code, state }),
    });
  }

  // Image Upload Helper
  async uploadImage(imageData, filename = null) {
    // Generate filename if not provided
    if (!filename) {
      const timestamp = Date.now();
      filename = `image_${timestamp}.jpg`;
    }

    // If imageData is a base64 string, we can send it directly
    // The backend should handle base64 to file conversion
    return this.request('/upload/image/', {
      method: 'POST',
      body: JSON.stringify({
        image: imageData,
        filename: filename
      }),
    });
  }

  // Batch image upload for multiple images
  async uploadImages(images) {
    const uploadPromises = images.map((img, index) => 
      this.uploadImage(img.data, img.filename || `image_${index + 1}.jpg`)
    );
    
    return Promise.all(uploadPromises);
  }

  // Policy Management
  async getPolicies() {
    return this.request('/policies/');
  }

  async createPolicy(policyData) {
    // For FormData, don't set Content-Type header
    const config = {
      method: 'POST',
      body: policyData, // FormData object
      headers: {} // Remove Content-Type to let browser set it
    };
    
    return this.request('/policies/', config);
  }

  async updatePolicy(policyId, policyData) {
    // For FormData, don't set Content-Type header
    const config = {
      method: 'PUT',
      body: policyData, // FormData object
      headers: {} // Remove Content-Type to let browser set it
    };
    
    return this.request(`/policies/${policyId}/`, config);
  }

  async deletePolicy(policyId) {
    return this.request(`/policies/${policyId}/`, { method: 'DELETE' });
  }

  // Delete uploaded image
  async deleteImage(imagePath) {
    return this.request(`/upload/image/`, {
      method: 'DELETE',
      body: JSON.stringify({ path: imagePath }),
    });
  }

  // Certificates API
  async getCertificates() {
    return this.request('/certificates/');
  }

  async getCertificate(id) {
    return this.request(`/certificates/${id}/`);
  }

  async createCertificate(data) {
    return this.request('/certificates/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateCertificate(id, data) {
    return this.request(`/certificates/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteCertificate(id) {
    return this.request(`/certificates/${id}/`, { method: 'DELETE' });
  }

  async bulkImportCertificates(certificatesData) {
    return this.request('/certificates/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ certificates: certificatesData }),
    });
  }

  async getCertificateIssues() {
    return this.request('/certificates/issues/');
  }

  async getCertificateIssue(id) {
    return this.request(`/certificates/issues/${id}/`);
  }

  async createCertificateIssue(data) {
    return this.request('/certificates/issues/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateCertificateIssue(id, data) {
    return this.request(`/certificates/issues/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteCertificateIssue(id) {
    return this.request(`/certificates/issues/${id}/`, { method: 'DELETE' });
  }

  async getCertificateDeclarations() {
    return this.request('/certificates/declarations/');
  }

  async getCertificateDeclaration(id) {
    return this.request(`/certificates/declarations/${id}/`);
  }

  async createCertificateDeclaration(data) {
    return this.request('/certificates/declarations/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateCertificateDeclaration(id, data) {
    return this.request(`/certificates/declarations/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteCertificateDeclaration(id) {
    return this.request(`/certificates/declarations/${id}/`, { method: 'DELETE' });
  }

  // Renewals API
  async getRenewals() {
    return this.request('/renewals/');
  }

  async getRenewal(id) {
    return this.request(`/renewals/${id}/`);
  }

  async createRenewal(data) {
    return this.request('/renewals/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateRenewal(id, data) {
    return this.request(`/renewals/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteRenewal(id) {
    return this.request(`/renewals/${id}/`, { method: 'DELETE' });
  }

  async bulkImportRenewals(renewalsData) {
    return this.request('/renewals/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ renewals: renewalsData }),
    });
  }

  // Reports API
  async getReports() {
    return this.request('/reports/');
  }

  async getReport(id) {
    return this.request(`/reports/${id}/`);
  }

  async createReport(data) {
    return this.request('/reports/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateReport(id, data) {
    return this.request(`/reports/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteReport(id) {
    return this.request(`/reports/${id}/`, { method: 'DELETE' });
  }

  async bulkImportReports(reportsData) {
    return this.request('/reports/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ reports: reportsData }),
    });
  }

  // Activities API
  async getActivities() {
    return this.request('/activities/');
  }

  async getActivity(id) {
    return this.request(`/activities/${id}/`);
  }

  async createActivity(data) {
    return this.request('/activities/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateActivity(id, data) {
    return this.request(`/activities/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteActivity(id) {
    return this.request(`/activities/${id}/`, { method: 'DELETE' });
  }

  async bulkImportActivities(activitiesData) {
    return this.request('/activities/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ activities: activitiesData }),
    });
  }

  // Files API
  async getAgentFiles() {
    return this.request('/files/');
  }

  async getAgentFile(id) {
    return this.request(`/files/${id}/`);
  }

  async createAgentFile(data) {
    return this.request('/files/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateAgentFile(id, data) {
    return this.request(`/files/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteAgentFile(id) {
    return this.request(`/files/${id}/`, { method: 'DELETE' });
  }

  async bulkImportAgentFiles(filesData) {
    return this.request('/files/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ files: filesData }),
    });
  }

  // Cover File API
  async getCovers() {
    return this.request('/coverfile/');
  }

  async getCover(id) {
    return this.request(`/coverfile/${id}/`);
  }

  async createCover(data) {
    return this.request('/coverfile/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateCover(id, data) {
    return this.request(`/coverfile/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteCover(id) {
    return this.request(`/coverfile/${id}/`, { method: 'DELETE' });
  }

  async bulkImportCovers(coversData) {
    return this.request('/coverfile/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ covers: coversData }),
    });
  }

  // Premium Rates API
  async getPremiumRates() {
    return this.request('/premium-rates/');
  }

  async getPremiumRate(id) {
    return this.request(`/premium-rates/${id}/`);
  }

  async createPremiumRate(data) {
    return this.request('/premium-rates/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updatePremiumRate(id, data) {
    return this.request(`/premium-rates/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deletePremiumRate(id) {
    return this.request(`/premium-rates/${id}/`, { method: 'DELETE' });
  }

  async bulkImportPremiumRates(ratesData) {
    return this.request('/premium-rates/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ premium_rates: ratesData }),
    });
  }

  // Transactions API
  async getTransactions() {
    return this.request('/transactions/');
  }

  async getTransaction(id) {
    return this.request(`/transactions/${id}/`);
  }

  async createTransaction(data) {
    return this.request('/transactions/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateTransaction(id, data) {
    return this.request(`/transactions/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteTransaction(id) {
    return this.request(`/transactions/${id}/`, { method: 'DELETE' });
  }

  async bulkImportTransactions(transactionsData) {
    return this.request('/transactions/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ transactions: transactionsData }),
    });
  }

  async getExtraPremiumsTrans() {
    return this.request('/transactions/extra-premiums/');
  }

  async getExtraPremiumTrans(id) {
    return this.request(`/transactions/extra-premiums/${id}/`);
  }

  async createExtraPremiumTrans(data) {
    return this.request('/transactions/extra-premiums/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateExtraPremiumTrans(id, data) {
    return this.request(`/transactions/extra-premiums/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteExtraPremiumTrans(id) {
    return this.request(`/transactions/extra-premiums/${id}/`, { method: 'DELETE' });
  }

  // Endorsements API
  async getEndorsements() {
    return this.request('/endorsements/');
  }

  async getEndorsement(id) {
    return this.request(`/endorsements/${id}/`);
  }

  async createEndorsement(data) {
    return this.request('/endorsements/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateEndorsement(id, data) {
    return this.request(`/endorsements/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteEndorsement(id) {
    return this.request(`/endorsements/${id}/`, { method: 'DELETE' });
  }

  async bulkImportEndorsements(endorsementsData) {
    return this.request('/endorsements/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ endorsements: endorsementsData }),
    });
  }

  // Receipts & Payments API
  async getReceipts() {
    return this.request('/receipts-payments/receipts/');
  }

  async getReceipt(id) {
    return this.request(`/receipts-payments/receipts/${id}/`);
  }

  async createReceipt(data) {
    return this.request('/receipts-payments/receipts/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateReceipt(id, data) {
    return this.request(`/receipts-payments/receipts/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteReceipt(id) {
    return this.request(`/receipts-payments/receipts/${id}/`, { method: 'DELETE' });
  }

  async bulkImportReceipts(receiptsData) {
    return this.request('/receipts-payments/receipts/bulk-import/', {
      method: 'POST',
      body: JSON.stringify({ receipts: receiptsData }),
    });
  }

  async getInsurerPayments() {
    return this.request('/receipts-payments/insurer-payments/');
  }

  async getInsurerPayment(id) {
    return this.request(`/receipts-payments/insurer-payments/${id}/`);
  }

  async createInsurerPayment(data) {
    return this.request('/receipts-payments/insurer-payments/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateInsurerPayment(id, data) {
    return this.request(`/receipts-payments/insurer-payments/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteInsurerPayment(id) {
    return this.request(`/receipts-payments/insurer-payments/${id}/`, { method: 'DELETE' });
  }

  async getPremiums() {
    return this.request('/receipts-payments/premiums/');
  }

  async getPremium(id) {
    return this.request(`/receipts-payments/premiums/${id}/`);
  }

  async createPremium(data) {
    return this.request('/receipts-payments/premiums/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updatePremium(id, data) {
    return this.request(`/receipts-payments/premiums/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deletePremium(id) {
    return this.request(`/receipts-payments/premiums/${id}/`, { method: 'DELETE' });
  }

  async getPremiumPaymentLogs() {
    return this.request('/receipts-payments/premium-payment-logs/');
  }

  async getPremiumPaymentLog(id) {
    return this.request(`/receipts-payments/premium-payment-logs/${id}/`);
  }

  async createPremiumPaymentLog(data) {
    return this.request('/receipts-payments/premium-payment-logs/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updatePremiumPaymentLog(id, data) {
    return this.request(`/receipts-payments/premium-payment-logs/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deletePremiumPaymentLog(id) {
    return this.request(`/receipts-payments/premium-payment-logs/${id}/`, { method: 'DELETE' });
  }

  async getPaymentLinks() {
    return this.request('/receipts-payments/payment-links/');
  }

  async getPaymentLink(id) {
    return this.request(`/receipts-payments/payment-links/${id}/`);
  }

  async createPaymentLink(data) {
    return this.request('/receipts-payments/payment-links/', { method: 'POST', body: JSON.stringify(data) });
  }

  async updatePaymentLink(id, data) {
    return this.request(`/receipts-payments/payment-links/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deletePaymentLink(id) {
    return this.request(`/receipts-payments/payment-links/${id}/`, { method: 'DELETE' });
  }
}

const apiService = new ApiService();
export default apiService;
