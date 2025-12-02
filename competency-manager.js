/**
 * Competency Framework Data Manager
 * Quản lý tất cả dữ liệu cho hệ thống đánh giá năng lực
 */

class CompetencyManager {
    constructor() {
        this.data = null;
        this.initialized = false;
    }

    /**
     * Khởi tạo dữ liệu từ file JSON
     */
    async initialize() {
        try {
            // Load Barista competencies from competencies-barista.json
            const response = await fetch('competencies-barista.json');
            const competencies = await response.json();
            
            // Transform to expected format if needed
            this.data = {
                competencies: competencies.map(comp => ({
                    id: comp.id,
                    name: comp.name || comp.nameVi,
                    nameVi: comp.nameVi || comp.name,
                    category: comp.category,
                    description: comp.definition,
                    proficiencyLevels: [
                        { name: 'Level 1', description: comp.level1 },
                        { name: 'Level 2', description: comp.level2 },
                        { name: 'Level 3', description: comp.level3 },
                        { name: 'Level 4', description: comp.level4 }
                    ],
                    trainingMethod: comp.trainingMethod,
                    evidence: comp.evidence
                })),
                employees: [], // Will be loaded separately
                assessments: []
            };
            
            this.initialized = true;
            console.log(`✅ Competency Manager initialized with ${this.data.competencies.length} Barista competencies`);
            return true;
        } catch (error) {
            console.error('❌ Error loading data:', error);
            return false;
        }
    }

    /**
     * Lấy tất cả năng lực
     */
    getCompetencies() {
        return this.data?.competencies || [];
    }

    /**
     * Lấy năng lực theo ID
     */
    getCompetencyById(id) {
        return this.data?.competencies?.find(c => c.id === id);
    }

    /**
     * Lấy tất cả nhân viên
     */
    getEmployees() {
        return this.data?.employees || [];
    }

    /**
     * Lấy nhân viên theo ID
     */
    getEmployeeById(id) {
        return this.data?.employees?.find(e => e.id === id);
    }

    /**
     * Lấy danh sách nhân viên theo store
     */
    getEmployeesByStore(store) {
        return this.data?.employees?.filter(e => e.store === store) || [];
    }

    /**
     * Lấy tất cả store
     */
    getStores() {
        return this.data?.stores || [];
    }

    /**
     * Lấy tất cả đánh giá
     */
    getAssessments() {
        return this.data?.assessments || [];
    }

    /**
     * Lấy đánh giá của nhân viên
     */
    getEmployeeAssessments(employeeId) {
        return this.data?.assessments?.filter(a => a.employee_id === employeeId) || [];
    }

    /**
     * Tính toán thống kê chung
     */
    getDashboardStats() {
        const totalEmployees = this.data?.employees?.length || 0;
        const totalAssessments = this.data?.assessments?.length || 0;
        const completedAssessments = totalAssessments;
        const completionRate = totalEmployees > 0 ? Math.round((completedAssessments / totalEmployees) * 100) : 0;

        // Tính phân bố mức độ từ competencyRatings
        const levelDistribution = { 1: 0, 2: 0, 3: 0, 4: 0 };
        this.data?.assessments?.forEach(assessment => {
            assessment.competencyRatings?.forEach(rating => {
                const levelMap = { 'Critical': 1, 'Low': 2, 'Medium': 3, 'High': 4 };
                const level = levelMap[rating.ratedLevel];
                if (level && levelDistribution[level] !== undefined) {
                    levelDistribution[level]++;
                }
            });
        });

        // Nếu không có dữ liệu assessment thực tế, dùng dữ liệu mẫu cho demo
        if (totalAssessments === 0 || (levelDistribution[1] + levelDistribution[2] + levelDistribution[3] + levelDistribution[4]) === 0) {
            levelDistribution[1] = 6;  // Critical: 5%
            levelDistribution[2] = 25; // Low: 20%
            levelDistribution[3] = 63; // Medium: 50%
            levelDistribution[4] = 31; // High: 25%
        }

        console.log('Dashboard Stats:', {
            totalEmployees,
            completedAssessments,
            completionRate,
            levelDistribution
        });

        return {
            totalEmployees,
            completedAssessments,
            completionRate,
            levelDistribution
        };
    }

    /**
     * Lấy tên vai trò theo loại
     */
    getRoleName(role) {
        const roleMap = {
            'Support': 'Support Roles (Vai trò Hỗ trợ)',
            'Supervisory': 'Supervisory Roles (Vai trò Giám sát)',
            'Senior Management': 'Senior Management Roles (Vai trò Quản lý Cấp cao)',
            'Leadership': 'Leadership Roles (Vai trò Lãnh đạo)'
        };
        return roleMap[role] || role;
    }

    /**
     * Lấy thông tin mức độ năng lực
     */
    getProficiencyLevel(level) {
        return this.data?.proficiency_levels?.[level] || {};
    }

    /**
     * Thêm đánh giá mới
     */
    addAssessment(employeeId, competencyId, level) {
        const newAssessment = {
            id: (this.data?.assessments?.length || 0) + 1,
            employee_id: employeeId,
            competency_id: competencyId,
            level: level,
            date: new Date().toISOString().split('T')[0],
            assessor: 'Admin'
        };
        
        if (!this.data.assessments) this.data.assessments = [];
        this.data.assessments.push(newAssessment);
        
        // Lưu vào localStorage
        this.saveToLocalStorage();
        return newAssessment;
    }

    /**
     * Thêm năng lực mới
     */
    addCompetency(competency) {
        if (!this.data.competencies) this.data.competencies = [];
        this.data.competencies.push(competency);
        this.saveToLocalStorage();
        return competency;
    }

    /**
     * Lưu dữ liệu vào localStorage
     */
    saveToLocalStorage() {
        if (this.data) {
            localStorage.setItem('competencyData', JSON.stringify(this.data));
        }
    }

    /**
     * Tải dữ liệu từ localStorage
     */
    loadFromLocalStorage() {
        const saved = localStorage.getItem('competencyData');
        if (saved) {
            this.data = JSON.parse(saved);
            return true;
        }
        return false;
    }
}

// Tạo instance toàn cầu
window.competencyManager = new CompetencyManager();

/**
 * Helper Functions
 */

// Định dạng ngày
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Lấy màu theo mức độ
function getColorByLevel(level) {
    const colors = {
        1: '#DE350B',
        2: '#FFAB00',
        3: '#00B8D9',
        4: '#36B37E'
    };
    return colors[level] || '#6B7280';
}

// Lấy tên mức độ
function getLevelName(level) {
    const names = {
        1: 'Critical',
        2: 'Low',
        3: 'Medium',
        4: 'High'
    };
    return names[level] || 'Unknown';
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', async () => {
    const success = await window.competencyManager.initialize();
    if (!success) {
        console.warn('⚠️ Failed to load data.json, attempting to use localStorage');
        if (!window.competencyManager.loadFromLocalStorage()) {
            console.error('❌ No data available');
        }
    }
    
    // Trigger custom event khi dữ liệu sẵn sàng
    window.dispatchEvent(new Event('competencyDataReady'));
});
