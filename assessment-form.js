// Assessment Form Handler
(function() {
    let employees = [];
    let competencies = [];
    let selectedEmployeeId = null;
    let competencyRatings = {};

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', async () => {
        await loadData();
        initializeForm();
        setupEventListeners();
    });

    async function loadData() {
        try {
            // Load Barista competencies
            const compResponse = await fetch('competencies-barista.json');
            const baristaComps = await compResponse.json();
            
            // Transform to expected format
            competencies = baristaComps.map(comp => ({
                id: comp.id,
                name: comp.name || comp.nameVi,
                description: comp.definition,
                category: comp.category
            }));
            
            // Load employees (mock data for now)
            employees = [
                { id: 'NV001', name: 'Nguyễn Văn A', position: 'Barista' },
                { id: 'NV002', name: 'Trần Thị B', position: 'Barista' },
                { id: 'NV003', name: 'Lê Văn C', position: 'Senior Barista' }
            ];
            
            console.log(`✅ Loaded ${competencies.length} Barista competencies`);
            
            // Populate employee dropdown
            populateEmployeeDropdown();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    function populateEmployeeDropdown() {
        const select = document.getElementById('employee-select');
        if (!select) return;

        select.innerHTML = '<option value="">Chọn nhân viên để đánh giá...</option>';
        employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.id;
            option.textContent = `${emp.name} (${emp.position}) - ${emp.store}`;
            select.appendChild(option);
        });
    }

    function initializeForm() {
        // Setup employee selection change event
        const employeeSelect = document.getElementById('employee-select');
        if (employeeSelect) {
            employeeSelect.addEventListener('change', handleEmployeeChange);
        }
    }

    function setupEventListeners() {
        console.log('📌 Setting up event listeners...');
        
        // Use event delegation for better handling
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            
            // Normalize text by removing all whitespace
            const btnText = btn.textContent.replace(/\s+/g, ' ').trim();
            console.log('🔘 Button clicked:', btnText);
            
            // Handle "Lưu" button
            if (btnText.includes('Lưu') && !btnText.includes('Xem')) {
                console.log('💾 Save button clicked');
                e.preventDefault();
                showSaveModal();
            }
            
            // Handle "Xem trước" button
            if (btnText.includes('Xem trước') || btnText.includes('Xem trước')) {
                console.log('👁️ Preview button clicked');
                e.preventDefault();
                showPreviewModal();
            }
        });
    }

    function handleEmployeeChange(event) {
        selectedEmployeeId = event.target.value;
        if (!selectedEmployeeId) {
            clearEmployeeInfo();
            clearCompetencies();
            return;
        }

        const employee = employees.find(e => e.id === selectedEmployeeId);
        if (employee) {
            displayEmployeeInfo(employee);
            displayCompetencies();
            // Reset ratings
            competencyRatings = {};
        }
    }

    function displayEmployeeInfo(employee) {
        const infoCard = document.querySelector('[data-alt="Profile picture of Nguyen Van An"]').parentElement;
        const infoText = infoCard.querySelector('div');
        
        if (infoText) {
            infoText.innerHTML = `
                <p class="text-[#0e121b] dark:text-white text-base font-bold leading-tight">${employee.name}</p>
                <p class="text-[#4e6797] dark:text-gray-400 text-sm font-normal leading-normal">
                    Vị trí: ${employee.position}
                </p>
                <p class="text-[#4e6797] dark:text-gray-400 text-sm font-normal leading-normal">
                    Cửa hàng: ${employee.store}
                </p>
                <p class="text-[#4e6797] dark:text-gray-400 text-sm font-normal leading-normal">
                    Phòng ban: ${employee.department}
                </p>
            `;
        }
    }

    function clearEmployeeInfo() {
        const infoCard = document.querySelector('[data-alt="Profile picture of Nguyen Van An"]').parentElement;
        const infoText = infoCard.querySelector('div');
        
        if (infoText) {
            infoText.innerHTML = `
                <p class="text-[#0e121b] dark:text-white text-base font-bold leading-tight">Chưa chọn nhân viên</p>
                <p class="text-[#4e6797] dark:text-gray-400 text-sm font-normal leading-normal">Vui lòng chọn nhân viên từ danh sách trên</p>
            `;
        }
    }

    function displayCompetencies() {
        // Tìm container với ID cụ thể
        let formSection = document.querySelector('.competencies-form');
        
        if (!formSection) {
            console.error('❌ Could not find .competencies-form element');
            return;
        }

        // Group competencies by category
        const groupedCompetencies = {};
        competencies.forEach(comp => {
            const category = comp.category || 'Khác';
            if (!groupedCompetencies[category]) {
                groupedCompetencies[category] = [];
            }
            groupedCompetencies[category].push(comp);
        });

        // Render competencies grouped by category
        formSection.innerHTML = Object.entries(groupedCompetencies).map(([category, comps]) => `
            <div class="flex flex-col gap-4">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-4 pb-2 border-b-2 border-primary/30">
                    ${category}
                    <span class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">(${comps.length} năng lực)</span>
                </h3>
                ${comps.map(comp => `
                    <div class="flex flex-col gap-4 p-6 bg-white dark:bg-background-dark rounded-xl border border-gray-200 dark:border-gray-700">
                        <div>
                            <h4 class="text-lg font-bold text-gray-900 dark:text-white">${comp.name}</h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${comp.description}</p>
                        </div>
                        <div class="flex gap-3 flex-wrap">
                            <button type="button" class="level-btn px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-primary" data-level="1" data-comp="${comp.id}">
                                <span class="text-sm font-medium">1</span>
                            </button>
                            <button type="button" class="level-btn px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-primary" data-level="2" data-comp="${comp.id}">
                                <span class="text-sm font-medium">2</span>
                            </button>
                            <button type="button" class="level-btn px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-primary" data-level="3" data-comp="${comp.id}">
                                <span class="text-sm font-medium">3</span>
                            </button>
                            <button type="button" class="level-btn px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-primary" data-level="4" data-comp="${comp.id}">
                                <span class="text-sm font-medium">4</span>
                            </button>
                        </div>
                        <textarea placeholder="Nhận xét (tùy chọn)" class="comment-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" data-comp="${comp.id}" rows="2"></textarea>
                    </div>
                `).join('')}
            </div>
        `).join('');

        console.log(`✅ Displayed ${competencies.length} competencies in ${Object.keys(groupedCompetencies).length} categories`);

        // Setup level button listeners
        formSection.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const compId = btn.dataset.comp;
                const level = btn.dataset.level;
                
                // Update rating
                competencyRatings[compId] = level;
                
                // Update UI
                const section = btn.closest('[class*="gap-4"]');
                section.querySelectorAll('.level-btn').forEach(b => {
                    if (b.dataset.comp === compId) {
                        if (b.dataset.level === level) {
                            b.classList.add('bg-primary', 'text-white', 'border-primary');
                        } else {
                            b.classList.remove('bg-primary', 'text-white', 'border-primary');
                            b.classList.add('border-gray-300', 'dark:border-gray-600');
                        }
                    }
                });
            });
        });
    }

    function clearCompetencies() {
        const formSection = document.querySelector('.competencies-form');
        if (formSection) {
            formSection.innerHTML = '<p class="text-gray-500">Chọn nhân viên để xem năng lực cần đánh giá</p>';
        }
    }

    function showPreviewModal() {
        console.log('👁️ showPreviewModal called');
        console.log('Selected Employee ID:', selectedEmployeeId);
        console.log('Competency Ratings:', competencyRatings);
        
        if (!selectedEmployeeId) {
            alert('Vui lòng chọn nhân viên');
            return;
        }

        if (Object.keys(competencyRatings).length === 0) {
            alert('Vui lòng đánh giá ít nhất một năng lực');
            return;
        }

        const employee = employees.find(e => e.id === selectedEmployeeId);
        const ratedCompetencies = Object.entries(competencyRatings).map(([compId, level]) => {
            const comp = competencies.find(c => c.id === compId);
            const textarea = document.querySelector(`textarea[data-comp="${compId}"]`);
            const levelColors = {
                1: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
                2: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
                3: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
                4: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
            };
            return {
                name: comp?.name,
                category: comp?.category || 'Khác',
                level: level,
                levelName: `Level ${level}`,
                levelColor: levelColors[level],
                comment: textarea?.value || 'Không có nhận xét'
            };
        });

        // Group rated competencies by category
        const groupedRatedComps = {};
        ratedCompetencies.forEach(comp => {
            if (!groupedRatedComps[comp.category]) {
                groupedRatedComps[comp.category] = [];
            }
            groupedRatedComps[comp.category].push(comp);
        });

        const avgScore = Math.round(Object.values(competencyRatings).reduce((a, b) => a + parseInt(b), 0) / Object.keys(competencyRatings).length * 100) / 100;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div class="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Xem Trước Đánh Giá</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Kiểm tra thông tin trước khi lưu</p>
                </div>
                
                <div class="flex-1 overflow-y-auto p-6">
                    <!-- Employee Info -->
                    <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Thông tin nhân viên</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div><span class="text-gray-600 dark:text-gray-400">Họ tên:</span> <span class="font-medium text-gray-900 dark:text-white block">${employee.name}</span></div>
                            <div><span class="text-gray-600 dark:text-gray-400">Mã NV:</span> <span class="font-medium text-gray-900 dark:text-white block">${employee.id}</span></div>
                            <div><span class="text-gray-600 dark:text-gray-400">Vị trí:</span> <span class="font-medium text-gray-900 dark:text-white block">${employee.position}</span></div>
                            <div><span class="text-gray-600 dark:text-gray-400">Cửa hàng:</span> <span class="font-medium text-gray-900 dark:text-white block">${employee.store}</span></div>
                        </div>
                    </div>

                    <!-- Overall Score -->
                    <div class="mb-6 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
                        <div class="text-center">
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Điểm trung bình</p>
                            <p class="text-3xl font-bold text-primary">${avgScore}/4</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${Object.keys(competencyRatings).length} năng lực được đánh giá</p>
                        </div>
                    </div>

                    <!-- Competencies List - Grouped by Category -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Chi tiết đánh giá</h3>
                        ${Object.entries(groupedRatedComps).map(([category, comps]) => `
                            <div class="mb-6">
                                <h4 class="text-base font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                                    ${category}
                                    <span class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">(${comps.length} năng lực)</span>
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    ${comps.map(comp => `
                                        <div class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div class="flex items-start justify-between mb-2">
                                                <h5 class="font-semibold text-sm text-gray-900 dark:text-white flex-1 pr-2">${comp.name}</h5>
                                                <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${comp.levelColor} whitespace-nowrap">
                                                    ${comp.levelName}
                                                </span>
                                            </div>
                                            ${comp.comment && comp.comment !== 'Không có nhận xét' ? `<p class="text-xs text-gray-600 dark:text-gray-400 italic line-clamp-2">${comp.comment}</p>` : '<p class="text-xs text-gray-400 dark:text-gray-500 italic">Không có nhận xét</p>'}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="p-6 border-t border-gray-200 dark:border-gray-800">
                    <div class="flex gap-3">
                        <button onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Đóng</button>
                        <button onclick="window.closePreviewAndSave()" class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Xác nhận & Lưu</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);

        // Handle close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Expose close and save handler
        window.closePreviewAndSave = function() {
            modal.remove();
            showSaveModal();
        };
    }

    function showSaveModal() {
        if (!selectedEmployeeId) {
            alert('Vui lòng chọn nhân viên');
            return;
        }

        if (Object.keys(competencyRatings).length === 0) {
            alert('Vui lòng đánh giá ít nhất một năng lực');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4">
                <div class="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">Lưu Đánh Giá</h2>
                </div>
                <form class="p-6 space-y-4" onsubmit="handleSaveAssessment(event)">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Xác nhận lưu đánh giá này?</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Đánh giá sẽ được lưu vào hệ thống.</p>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Hủy</button>
                        <button type="submit" class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Lưu</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Handle close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Expose handler to window
        window.handleSaveAssessment = function(event) {
            event.preventDefault();
            const employee = employees.find(e => e.id === selectedEmployeeId);
            
            const assessment = {
                id: `ASS${Date.now()}`,
                employeeId: selectedEmployeeId,
                employeeName: employee.name,
                evaluatorId: 'ADM001',
                evaluatorName: 'Quản trị viên hệ thống',
                date: new Date().toISOString().split('T')[0],
                competencyRatings: Object.entries(competencyRatings).map(([compId, level]) => {
                    const comp = competencies.find(c => c.id === compId);
                    const textarea = document.querySelector(`textarea[data-comp="${compId}"]`);
                    return {
                        competencyId: compId,
                        competencyName: comp?.name,
                        ratedLevel: level,
                        comment: textarea?.value || ''
                    };
                }),
                overallScore: Math.round(Object.values(competencyRatings).reduce((a, b) => a + parseInt(b), 0) / Object.keys(competencyRatings).length * 100) / 100,
                status: 'completed'
            };

            // Save to localStorage
            let assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
            assessments.push(assessment);
            localStorage.setItem('assessments', JSON.stringify(assessments));

            modal.remove();
            alert('Lưu đánh giá thành công!');
            
            // Reset form
            document.getElementById('employee-select').value = '';
            clearEmployeeInfo();
            clearCompetencies();
            competencyRatings = {};
            selectedEmployeeId = null;
        };
    }
})();
