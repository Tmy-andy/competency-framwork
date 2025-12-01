// Assessment Manager - Handle competency assessment functionality
class AssessmentManager {
    constructor() {
        this.assessments = [];
        this.competencies = [];
        this.employees = [];
        this.initialize();
    }

    async initialize() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            
            this.competencies = data.competencies || [];
            this.employees = data.employees || [];
            this.assessments = data.assessments || [];
            
            // Dispatch event when data is ready
            window.dispatchEvent(new CustomEvent('assessmentDataReady'));
        } catch (error) {
            console.error('Error loading assessment data:', error);
        }
    }

    getEmployees() {
        return this.employees;
    }

    getCompetencies() {
        return this.competencies;
    }

    getEmployeeById(id) {
        return this.employees.find(emp => emp.id === id);
    }

    getCompetencyById(id) {
        return this.competencies.find(comp => comp.id === id);
    }

    getAssessmentsByEmployee(employeeId) {
        return this.assessments.filter(ass => ass.employeeId === employeeId);
    }

    saveAssessment(assessment) {
        const existingIndex = this.assessments.findIndex(a => a.id === assessment.id);
        
        if (existingIndex >= 0) {
            // Update existing
            this.assessments[existingIndex] = assessment;
        } else {
            // Add new
            assessment.id = `ASS${Date.now()}`;
            this.assessments.push(assessment);
        }
        
        // Save to localStorage
        localStorage.setItem('assessments', JSON.stringify(this.assessments));
        return assessment;
    }

    deleteAssessment(assessmentId) {
        this.assessments = this.assessments.filter(a => a.id !== assessmentId);
        localStorage.setItem('assessments', JSON.stringify(this.assessments));
    }

    calculateOverallScore(ratings) {
        if (!ratings || ratings.length === 0) return 0;
        
        const levelMap = { 'Critical': 1, 'Low': 2, 'Medium': 3, 'High': 4 };
        const scores = ratings.map(r => levelMap[r.ratedLevel] || 0);
        const total = scores.reduce((a, b) => a + b, 0);
        return (total / ratings.length).toFixed(2);
    }
}

// Create global instance
window.assessmentManager = new AssessmentManager();
