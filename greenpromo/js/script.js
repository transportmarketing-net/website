/*
   ST.RIVE — Homepage Interactions
   Split-screen hero, modal handling, form AJAX, burger menu
*/

(function () {
    'use strict';

    // Close an open modal or navigation drawer on Escape.
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (window.location.hash) window.location.hash = '';
            if (nav && nav.classList.contains('open')) closeNav();
        }
    });

    // Close modal when clicking overlay background
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                window.location.hash = '';
            }
        });
    });

    // --- Service Request Form Handling (Homepage Modal) ---

    var inquiryForm = document.getElementById('inquiry-form');
    var modalTypeInput = document.getElementById('modal-inquiry-type');
    var modalEmployerFields = document.getElementById('modal-employer-fields');
    var modalWorkerFields = document.getElementById('modal-worker-fields');
    var modalServiceSelect = document.getElementById('modal-service');
    var modalSubmitBtn = document.getElementById('form-submit-btn');
    var modalSubmitEmployer = inquiryForm ? inquiryForm.querySelector('.submit-text--employer') : null;
    var modalSubmitWorker = inquiryForm ? inquiryForm.querySelector('.submit-text--worker') : null;
    var isEnglish = !window.location.pathname.startsWith('/el');
    var localePrefix = window.location.pathname.startsWith('/el') ? '/el' : '';

    // Toggle required attributes on/off for a container's fields
    function modalToggleRequired(container, enable) {
        if (!container) return;
        if (!enable) {
            container.querySelectorAll('[required]').forEach(function (el) {
                el.removeAttribute('required');
                el.dataset.wasRequired = '1';
            });
            container.querySelectorAll('[data-worker-required]').forEach(function (el) {
                el.removeAttribute('required');
            });
        } else {
            container.querySelectorAll('[data-was-required]').forEach(function (el) {
                el.setAttribute('required', '');
                delete el.dataset.wasRequired;
            });
            container.querySelectorAll('[data-worker-required]').forEach(function (el) {
                el.setAttribute('required', '');
            });
        }
    }

    // Switch modal between employer and worker modes
    function setModalType(type) {
        if (!modalTypeInput) return;
        modalTypeInput.value = type;

        if (type === 'worker') {
            if (modalEmployerFields) modalEmployerFields.style.display = 'none';
            if (modalWorkerFields) modalWorkerFields.style.display = '';
            modalToggleRequired(modalEmployerFields, false);
            modalToggleRequired(modalWorkerFields, true);
            if (modalSubmitEmployer) modalSubmitEmployer.style.display = 'none';
            if (modalSubmitWorker) modalSubmitWorker.style.display = 'inline';
        } else {
            if (modalEmployerFields) modalEmployerFields.style.display = '';
            if (modalWorkerFields) modalWorkerFields.style.display = 'none';
            modalToggleRequired(modalEmployerFields, true);
            modalToggleRequired(modalWorkerFields, false);
            if (modalSubmitEmployer) modalSubmitEmployer.style.display = 'inline';
            if (modalSubmitWorker) modalSubmitWorker.style.display = 'none';
        }
    }

    // Toggle card click handlers
    if (inquiryForm) {
        inquiryForm.querySelectorAll('.inquiry-type-card').forEach(function (card) {
            card.addEventListener('click', function () {
                inquiryForm.querySelectorAll('.inquiry-type-card').forEach(function (c) { c.classList.remove('active'); });
                card.classList.add('active');
                setModalType(card.dataset.type);
            });
        });

        // Initialize: worker fields not required
        modalToggleRequired(modalWorkerFields, false);
    }

    // Pre-select service when clicking CTA buttons (panels or category CTAs)
    document.querySelectorAll('.btn-request').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var service = btn.getAttribute('data-service');
            if (modalServiceSelect && service) {
                modalServiceSelect.value = service;
            }
            if (modalServiceSelect && btn.hasAttribute('data-general-request')) {
                modalServiceSelect.value = '';
            }
            if (inquiryForm && service) {
                inquiryForm.action = localePrefix + '/services/' + service + '/inquiry';
                // If worker mode active, auto-check the corresponding service interest
                if (modalTypeInput && modalTypeInput.value === 'worker') {
                    var cb = inquiryForm.querySelector('input[name="service_interests[]"][value="' + service + '"]');
                    if (cb) cb.checked = true;
                }
            }
        });
    });

    // Update form action when service dropdown changes
    if (modalServiceSelect) {
        modalServiceSelect.addEventListener('change', function () {
            if (inquiryForm) {
                inquiryForm.action = localePrefix + '/services/' + modalServiceSelect.value + '/inquiry';
            }
        });
    }

    // Resolve form action for worker submissions (use first checked service interest)
    function resolveWorkerFormAction() {
        if (!inquiryForm) return;
        var checked = inquiryForm.querySelector('input[name="service_interests[]"]:checked');
        var slug = checked ? checked.value : 'domestic-helper';
        inquiryForm.action = localePrefix + '/services/' + slug + '/inquiry';
    }

    // AJAX form submission
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var errorsDiv = document.getElementById('form-errors');
            var successDiv = document.getElementById('form-success');

            // For worker submissions, set form action to first checked service
            if (modalTypeInput && modalTypeInput.value === 'worker') {
                resolveWorkerFormAction();
            }

            // Reset states
            errorsDiv.style.display = 'none';
            errorsDiv.innerHTML = '';
            successDiv.style.display = 'none';
            modalSubmitBtn.disabled = true;
            var activeText = modalSubmitBtn.querySelector('.submit-text--employer, .submit-text--worker');
            if (activeText) activeText.textContent = isEnglish ? 'Submitting...' : 'Υποβολή...';

            var formData = new FormData(inquiryForm);
            var csrfToken = document.querySelector('meta[name="csrf-token"]');

            fetch(inquiryForm.action, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken ? csrfToken.getAttribute('content') : ''
                },
                body: formData
            })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                if (response.status === 422) {
                    return response.json().then(function (data) {
                        throw { validation: true, errors: data.errors };
                    });
                }
                throw { validation: false };
            })
            .then(function (data) {
                successDiv.style.display = 'block';
                inquiryForm.reset();
                // Reset toggle to employer default
                setModalType('employer');
                inquiryForm.querySelectorAll('.inquiry-type-card').forEach(function (c) { c.classList.remove('active'); });
                var employerCard = inquiryForm.querySelector('.inquiry-type-card--employer');
                if (employerCard) employerCard.classList.add('active');
                modalSubmitBtn.disabled = true;
                if (modalSubmitEmployer) modalSubmitEmployer.textContent = isEnglish ? 'Submitted ✓' : 'Υποβλήθηκε ✓';
            })
            .catch(function (err) {
                if (err && err.validation && err.errors) {
                    var html = '<ul>';
                    Object.keys(err.errors).forEach(function (key) {
                        err.errors[key].forEach(function (msg) {
                            html += '<li>' + msg + '</li>';
                        });
                    });
                    html += '</ul>';
                    errorsDiv.innerHTML = html;
                    errorsDiv.style.display = 'block';
                } else {
                    errorsDiv.innerHTML = '<p>' + (isEnglish ? 'Something went wrong. Please try again.' : 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.') + '</p>';
                    errorsDiv.style.display = 'block';
                }
                modalSubmitBtn.disabled = false;
                if (modalSubmitEmployer) modalSubmitEmployer.textContent = isEnglish ? 'Submit Inquiry' : 'Υποβολή Αίτησης';
                if (modalSubmitWorker) modalSubmitWorker.textContent = isEnglish ? 'Submit Application' : 'Υποβολή Αίτησης Εργασίας';
            });
        });
    }

    // --- Dual Inquiry Form ---
    (function () {
        var dualForm = document.getElementById('inquiry-form-dual');
        if (!dualForm) return;

        var slug = dualForm.dataset.slug;
        var partialUrl = dualForm.dataset.partialUrl;
        var isB2B = dualForm.dataset.isB2b === '1';
        var locale = dualForm.dataset.locale;
        var isEnglish = locale !== 'el';

        var typeInput = document.getElementById('inquiry-type-input');
        var employerFields = document.getElementById('employer-fields');
        var workerFields = document.getElementById('worker-fields');
        var errorsDiv = document.getElementById('form-errors-dual');
        var successDiv = document.getElementById('form-success-dual');
        var submitBtn = document.getElementById('form-submit-btn-dual');
        var submitTextEmployer = dualForm.querySelector('.submit-text--employer');
        var submitTextWorker = dualForm.querySelector('.submit-text--worker');

        // Type card toggle
        var typeCards = dualForm.querySelectorAll('.inquiry-type-card');
        typeCards.forEach(function (card) {
            card.addEventListener('click', function () {
                var type = card.dataset.type;
                typeCards.forEach(function (c) { c.classList.remove('active'); });
                card.classList.add('active');
                typeInput.value = type;

                if (type === 'worker') {
                    employerFields.style.display = 'none';
                    workerFields.style.display = '';
                    // Disable employer required fields
                    toggleRequired(employerFields, false);
                    toggleRequired(workerFields, true);
                    if (submitTextEmployer) submitTextEmployer.style.display = 'none';
                    if (submitTextWorker) submitTextWorker.style.display = 'inline';
                } else {
                    employerFields.style.display = '';
                    workerFields.style.display = 'none';
                    toggleRequired(employerFields, true);
                    toggleRequired(workerFields, false);
                    if (submitTextEmployer) submitTextEmployer.style.display = 'inline';
                    if (submitTextWorker) submitTextWorker.style.display = 'none';
                }

                // Show conditional service-specific fields
                showConditionalFields(slug);
            });
        });

        function toggleRequired(container, enable) {
            if (!container) return;
            container.querySelectorAll('[required]').forEach(function (el) {
                if (!enable) {
                    el.removeAttribute('required');
                    el.dataset.wasRequired = '1';
                }
            });
            if (enable) {
                container.querySelectorAll('[data-was-required]').forEach(function (el) {
                    el.setAttribute('required', '');
                    delete el.dataset.wasRequired;
                });
            }
        }

        // Disable/enable all form elements inside a container.
        // Disabled elements are excluded from FormData, preventing
        // duplicate-name fields in hidden blocks from overwriting values.
        function toggleBlockFields(container, enable) {
            if (!container) return;
            container.querySelectorAll('input, select, textarea').forEach(function (el) {
                el.disabled = !enable;
            });
        }

        // Conditional employer fields by service
        function showConditionalFields(currentSlug) {
            dualForm.querySelectorAll('.conditional-fields').forEach(function (block) {
                var services = block.dataset.service.split(',');
                if (services.indexOf(currentSlug) !== -1 && typeInput.value === 'employer') {
                    block.style.display = '';
                    toggleBlockFields(block, true);
                } else {
                    block.style.display = 'none';
                    toggleBlockFields(block, false);
                    // Collapse any open "More Details" when hiding
                    var moreFields = block.querySelector('.more-details-fields');
                    var moreToggle = block.querySelector('.more-details-toggle');
                    if (moreFields) moreFields.style.display = 'none';
                    if (moreToggle) {
                        moreToggle.classList.remove('more-details-toggle--open');
                        moreToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            // B2B sub-conditional fields (hotel departments, factory shifts)
            dualForm.querySelectorAll('.b2b-sub-fields').forEach(function (block) {
                if (block.dataset.b2bService === currentSlug) {
                    block.style.display = '';
                } else {
                    block.style.display = 'none';
                }
            });
        }

        // "More Details" toggle handler
        dualForm.addEventListener('click', function (e) {
            var toggle = e.target.closest('.more-details-toggle');
            if (!toggle) return;
            var fields = toggle.nextElementSibling;
            if (!fields || !fields.classList.contains('more-details-fields')) return;

            var isOpen = fields.style.display !== 'none';
            if (isOpen) {
                fields.style.display = 'none';
                toggle.classList.remove('more-details-toggle--open');
                toggle.setAttribute('aria-expanded', 'false');
            } else {
                fields.style.display = '';
                toggle.classList.add('more-details-toggle--open');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });

        // Initialize conditional fields on load
        showConditionalFields(slug);

        // Disable B2C-only / B2B-only employer fields based on service category
        var b2cFields = dualForm.querySelector('.employer-b2c-fields');
        var b2bFields = dualForm.querySelector('.employer-b2b-fields');
        if (isB2B) {
            toggleBlockFields(b2cFields, false);
            toggleBlockFields(b2bFields, true);
        } else {
            toggleBlockFields(b2cFields, true);
            toggleBlockFields(b2bFields, false);
        }

        // If B2B, disable worker fields initially
        if (isB2B) {
            toggleRequired(workerFields, false);
        } else {
            // Default to employer, disable worker
            toggleRequired(workerFields, false);
        }

        // B2B worker link (redirect to service page with worker toggle)
        var b2bWorkerLink = document.getElementById('b2b-worker-link');
        if (b2bWorkerLink) {
            b2bWorkerLink.addEventListener('click', function (e) {
                e.preventDefault();
                // Show worker fields on current page
                typeInput.value = 'worker';
                if (employerFields) employerFields.style.display = 'none';
                if (workerFields) workerFields.style.display = '';
                toggleRequired(employerFields, false);
                toggleRequired(workerFields, true);
                if (submitTextEmployer) submitTextEmployer.style.display = 'none';
                if (submitTextWorker) submitTextWorker.style.display = 'inline';
                dualForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        // CV file upload handling
        var cvInput = document.getElementById('cv');
        var cvUploadZone = document.getElementById('cv-upload-zone');
        var cvFileName = document.getElementById('cv-file-name');

        if (cvInput) {
            cvInput.addEventListener('change', function () {
                if (cvInput.files.length > 0) {
                    var file = cvInput.files[0];
                    var validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    var maxSize = 5 * 1024 * 1024;

                    if (validTypes.indexOf(file.type) === -1) {
                        cvInput.value = '';
                        cvFileName.textContent = isEnglish ? 'Invalid file type. Use PDF, DOC, or DOCX.' : 'Μη έγκυρος τύπος αρχείου. Χρησιμοποιήστε PDF, DOC ή DOCX.';
                        if (cvUploadZone) cvUploadZone.classList.remove('has-file');
                        return;
                    }
                    if (file.size > maxSize) {
                        cvInput.value = '';
                        cvFileName.textContent = isEnglish ? 'File too large. Max 5MB.' : 'Πολύ μεγάλο αρχείο. Μέγ. 5MB.';
                        if (cvUploadZone) cvUploadZone.classList.remove('has-file');
                        return;
                    }

                    cvFileName.textContent = file.name;
                    if (cvUploadZone) cvUploadZone.classList.add('has-file');
                } else {
                    cvFileName.textContent = isEnglish ? 'PDF, DOC, or DOCX (max 5MB)' : 'PDF, DOC ή DOCX (μέγ. 5MB)';
                    if (cvUploadZone) cvUploadZone.classList.remove('has-file');
                }
            });

            // Drag and drop
            if (cvUploadZone) {
                cvUploadZone.addEventListener('dragover', function (e) {
                    e.preventDefault();
                    cvUploadZone.classList.add('dragover');
                });
                cvUploadZone.addEventListener('dragleave', function () {
                    cvUploadZone.classList.remove('dragover');
                });
                cvUploadZone.addEventListener('drop', function (e) {
                    e.preventDefault();
                    cvUploadZone.classList.remove('dragover');
                    if (e.dataTransfer.files.length > 0) {
                        cvInput.files = e.dataTransfer.files;
                        cvInput.dispatchEvent(new Event('change'));
                    }
                });
            }
        }

        // Partial submission (save contact info on blur)
        var partialSaved = false;
        var partialFields = dualForm.querySelectorAll('[data-partial-field]');

        partialFields.forEach(function (field) {
            field.addEventListener('blur', function () {
                if (partialSaved) return;
                var nameVal = document.getElementById('inquiry-name').value.trim();
                var emailVal = document.getElementById('inquiry-email').value.trim();
                var phoneVal = document.getElementById('inquiry-phone').value.trim();

                if (!emailVal || emailVal.indexOf('@') === -1) return;

                partialSaved = true;
                var csrfToken = document.querySelector('meta[name="csrf-token"]');

                fetch(partialUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken ? csrfToken.getAttribute('content') : ''
                    },
                    body: JSON.stringify({
                        name: nameVal,
                        email: emailVal,
                        phone: phoneVal,
                        inquiry_type: typeInput.value
                    })
                }).catch(function () {
                    partialSaved = false;
                });
            });
        });

        // AJAX form submission
        dualForm.addEventListener('submit', function (e) {
            e.preventDefault();

            errorsDiv.style.display = 'none';
            errorsDiv.innerHTML = '';
            successDiv.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.querySelector('.submit-text--employer, .submit-text--worker').textContent = isEnglish ? 'Submitting...' : 'Υποβολή...';

            var formData = new FormData(dualForm);
            var csrfToken = document.querySelector('meta[name="csrf-token"]');

            fetch(dualForm.action, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken ? csrfToken.getAttribute('content') : ''
                },
                body: formData
            })
            .then(function (response) {
                if (response.ok) return response.json();
                if (response.status === 422) {
                    return response.json().then(function (data) {
                        throw { validation: true, errors: data.errors };
                    });
                }
                throw { validation: false };
            })
            .then(function (data) {
                successDiv.textContent = data.message || (isEnglish ? 'Submitted successfully!' : 'Υποβλήθηκε επιτυχώς!');
                successDiv.style.display = 'block';
                dualForm.reset();
                // Collapse all open "More Details" sections
                dualForm.querySelectorAll('.more-details-fields').forEach(function (f) { f.style.display = 'none'; });
                dualForm.querySelectorAll('.more-details-toggle').forEach(function (t) {
                    t.classList.remove('more-details-toggle--open');
                    t.setAttribute('aria-expanded', 'false');
                });
                submitBtn.disabled = true;
                var visibleText = typeInput.value === 'worker'
                    ? (isEnglish ? 'Submitted' : 'Υποβλήθηκε')
                    : (isEnglish ? 'Submitted' : 'Υποβλήθηκε');
                submitBtn.querySelector('.submit-text--employer').textContent = visibleText;
                submitBtn.querySelector('.submit-text--worker').textContent = visibleText;
            })
            .catch(function (err) {
                if (err && err.validation && err.errors) {
                    var html = '<ul>';
                    Object.keys(err.errors).forEach(function (key) {
                        err.errors[key].forEach(function (msg) {
                            html += '<li>' + msg + '</li>';
                        });
                    });
                    html += '</ul>';
                    errorsDiv.innerHTML = html;
                    errorsDiv.style.display = 'block';
                } else {
                    errorsDiv.innerHTML = '<p>' + (isEnglish ? 'Something went wrong. Please try again.' : 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.') + '</p>';
                    errorsDiv.style.display = 'block';
                }
                submitBtn.disabled = false;
                if (submitTextEmployer) submitTextEmployer.textContent = isEnglish ? 'Submit Inquiry' : 'Υποβολή Αίτησης';
                if (submitTextWorker) submitTextWorker.textContent = isEnglish ? 'Submit Application' : 'Υποβολή Αίτησης Εργασίας';
            });
        });
    })();

    // --- Burger menu toggle ---
    var burger = document.querySelector('.burger');
    var nav = document.querySelector('.nav');
    var navOverlay = document.querySelector('.nav-overlay');
    var navClose = document.querySelector('.nav-close');

    if (nav && !nav.id) nav.id = 'primary-navigation';
    if (burger) {
        burger.setAttribute('aria-controls', nav ? nav.id : 'primary-navigation');
        burger.setAttribute('aria-expanded', 'false');
    }

    function openNav() {
        if (nav) nav.classList.add('open');
        if (navOverlay) navOverlay.classList.add('active');
        if (burger) {
            burger.classList.add('hidden');
            burger.setAttribute('aria-expanded', 'true');
        }
        document.body.classList.add('nav-open');
        if (navClose) navClose.focus();
    }

    function closeNav() {
        if (nav) nav.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('active');
        if (burger) {
            burger.classList.remove('hidden');
            burger.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('nav-open');
        // Collapse all dropdowns on close
        document.querySelectorAll('.nav-dropdown.open').forEach(function (d) {
            d.classList.remove('open');
            var trigger = d.querySelector('.nav-dropdown__trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
    }

    if (burger) burger.addEventListener('click', openNav);
    if (navClose) navClose.addEventListener('click', closeNav);
    if (navOverlay) navOverlay.addEventListener('click', closeNav);

    // Close nav when clicking a nav link (but NOT dropdown triggers)
    document.querySelectorAll('.nav a:not(.nav-dropdown__trigger)').forEach(function (link) {
        link.addEventListener('click', closeNav);
    });

    // --- Mobile dropdown accordion ---
    document.querySelectorAll('.nav-dropdown__trigger').forEach(function (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.addEventListener('click', function (e) {
            if (window.innerWidth > 1120) return;
            e.preventDefault();
            e.stopPropagation();
            var parent = trigger.closest('.nav-dropdown');
            // Close other dropdowns (accordion behavior)
            document.querySelectorAll('.nav-dropdown.open').forEach(function (d) {
                if (d !== parent) {
                    d.classList.remove('open');
                    var otherTrigger = d.querySelector('.nav-dropdown__trigger');
                    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                }
            });
            parent.classList.toggle('open');
            trigger.setAttribute('aria-expanded', parent.classList.contains('open') ? 'true' : 'false');
        });
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 1120 && nav && nav.classList.contains('open')) closeNav();
    });

    // Accessible FAQ disclosures on service pages.
    document.querySelectorAll('.faq-question').forEach(function (question, index) {
        var answer = question.nextElementSibling;
        if (!answer) return;

        var answerId = 'faq-answer-' + (index + 1);
        answer.id = answerId;
        question.setAttribute('aria-controls', answerId);
        question.setAttribute('aria-expanded', 'false');
        question.addEventListener('click', function () {
            var item = question.closest('.faq-item');
            if (!item) return;
            item.classList.toggle('faq-item--open');
            question.setAttribute('aria-expanded', item.classList.contains('faq-item--open') ? 'true' : 'false');
        });
    });

    // --- Hero Slideshow Crossfade (synced) ---
    (function () {
        var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        var slideshows = document.querySelectorAll('[data-slideshow]');
        if (!slideshows.length) return;

        var delay = 7000;
        var timer = null;

        // Build list of slideshow instances
        var decks = [];
        slideshows.forEach(function (el) {
            var slides = el.querySelectorAll('.slideshow__slide');
            if (slides.length < 2) return;
            decks.push({ slides: slides, current: 0 });
        });

        if (!decks.length) return;

        function advanceAll() {
            decks.forEach(function (deck) {
                deck.slides[deck.current].classList.remove('slideshow__slide--active');
                deck.current = (deck.current + 1) % deck.slides.length;
                deck.slides[deck.current].classList.add('slideshow__slide--active');
            });
            schedule();
        }

        function schedule() {
            clearTimeout(timer);
            if (!document.hidden) {
                timer = setTimeout(advanceAll, delay);
            }
        }

        function stop() {
            clearTimeout(timer);
            timer = null;
        }

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) { stop(); } else { schedule(); }
        });

        schedule();
    })();

    // --- Logo as modal escape button ---
    document.querySelectorAll('.logo').forEach(function (logo) {
        logo.addEventListener('click', function (e) {
            if (window.location.hash && window.location.hash !== '#') {
                e.preventDefault();
                window.location.hash = '';
                var localePrefix = window.location.pathname.startsWith('/en') ? '/en' : '/';
                setTimeout(function () {
                    window.location.href = localePrefix;
                }, 300);
            }
        });
    });

    // --- Staff Specialties: Click-to-form + AJAX submission ---
    (function () {
        var specForm = document.getElementById('specialties-inquiry-form');
        if (!specForm) return;

        var categorySelect = document.getElementById('spec-category');
        var specialtiesTextarea = document.getElementById('spec-specialties');
        var errorsDiv = document.getElementById('specialties-form-errors');
        var successDiv = document.getElementById('specialties-form-success');
        var submitBtn = document.getElementById('specialties-submit-btn');
        var isEnglish = !window.location.pathname.startsWith('/el');

        // Click handler for individual specialty items
        document.querySelectorAll('.specialties-card__list li[data-specialty]').forEach(function (li) {
            li.addEventListener('click', function () {
                handleSpecialtyClick(li.dataset.category, li.dataset.specialty);
            });
        });

        // Click handler for category titles
        document.querySelectorAll('.specialties-card__title[data-category]').forEach(function (h2) {
            h2.addEventListener('click', function () {
                if (categorySelect) categorySelect.value = h2.dataset.category;
                document.getElementById('staffing-request').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // Keyboard accessibility: Enter/Space triggers click on role=button
        document.querySelectorAll('[role="button"][tabindex="0"]').forEach(function (el) {
            el.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        });

        function handleSpecialtyClick(category, specialty) {
            // Set category dropdown
            if (categorySelect && category) {
                categorySelect.value = category;
            }

            // Append specialty to textarea (deduplicated)
            if (specialtiesTextarea && specialty) {
                var current = specialtiesTextarea.value.trim();
                var items = current ? current.split(/,\s*/) : [];
                if (items.indexOf(specialty) === -1) {
                    items.push(specialty);
                    specialtiesTextarea.value = items.join(', ');
                }
            }

            // Scroll to form
            document.getElementById('staffing-request').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // AJAX form submission
        specForm.addEventListener('submit', function (e) {
            e.preventDefault();

            errorsDiv.style.display = 'none';
            errorsDiv.innerHTML = '';
            successDiv.style.display = 'none';
            submitBtn.disabled = true;
            var originalText = submitBtn.textContent;
            submitBtn.textContent = isEnglish ? 'Submitting...' : 'Υποβολή...';

            var formData = new FormData(specForm);
            var csrfToken = document.querySelector('meta[name="csrf-token"]');

            fetch(specForm.action, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken ? csrfToken.getAttribute('content') : ''
                },
                body: formData
            })
            .then(function (response) {
                if (response.ok) return response.json();
                if (response.status === 422) {
                    return response.json().then(function (data) {
                        throw { validation: true, errors: data.errors };
                    });
                }
                throw { validation: false };
            })
            .then(function (data) {
                successDiv.textContent = data.message || (isEnglish ? 'Submitted successfully!' : 'Υποβλήθηκε επιτυχώς!');
                successDiv.style.display = 'block';
                specForm.reset();
                submitBtn.disabled = true;
                submitBtn.textContent = isEnglish ? 'Submitted' : 'Υποβλήθηκε';
            })
            .catch(function (err) {
                if (err && err.validation && err.errors) {
                    var html = '<ul>';
                    Object.keys(err.errors).forEach(function (key) {
                        err.errors[key].forEach(function (msg) {
                            html += '<li>' + msg + '</li>';
                        });
                    });
                    html += '</ul>';
                    errorsDiv.innerHTML = html;
                    errorsDiv.style.display = 'block';
                } else {
                    errorsDiv.innerHTML = '<p>' + (isEnglish ? 'Something went wrong. Please try again.' : 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.') + '</p>';
                    errorsDiv.style.display = 'block';
                }
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
        });
    })();
})();
