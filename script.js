document.addEventListener("DOMContentLoaded", () => {

    /* ============================
       FOOTER
    ============================ */
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* ============================
       SCROLL
    ============================ */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    /* ============================
       NAVIGATION ON SCROLL
    ============================ */
    const sections = Array.from(document.querySelectorAll("main .section"));
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));

    if (sections.length && navLinks.length) {
        const setActiveNav = () => {
            const scrollPos = window.scrollY + 120;
            let currentId = sections[0]?.id || "";

            sections.forEach(sec => {
                const top = sec.offsetTop;
                if (scrollPos >= top) {
                    currentId = sec.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${currentId}`
                );
            });
        };

        window.addEventListener("scroll", setActiveNav);
        setActiveNav();
    }

    /* ============================
       REVEAL ON SCROLL
    ============================ */
    const revealEls = document.querySelectorAll(".reveal");

    if (revealEls.length) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealEls.forEach(el => observer.observe(el));
    }

    /* ============================
       BACK TO TOP BUTTON
    ============================ */
    const backToTop = document.getElementById("backToTop");

    if (backToTop) {
        window.addEventListener("scroll", () => {
            backToTop.classList.toggle("visible", window.scrollY > 400);
        });

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ============================
       SAY HELLO MODAL
    ============================ */
    const helloBtn = document.getElementById("sayHelloBtn");
    const helloModal = document.getElementById("helloModal");
    const helloClose = document.getElementById("helloClose");
    const helloForm = document.getElementById("helloForm");
    const helloStatus = document.getElementById("helloStatus");

    if (helloBtn && helloModal && helloClose && helloForm && helloStatus) {

        const openModal = () => {
            helloModal.setAttribute("aria-hidden", "false");
        };

        const closeModal = () => {
            helloModal.setAttribute("aria-hidden", "true");
        };

        helloBtn.addEventListener("click", openModal);
        helloClose.addEventListener("click", closeModal);

        helloModal.addEventListener("click", e => {
            if (e.target === helloModal) closeModal();
        });

        window.addEventListener("keydown", e => {
            if (e.key === "Escape") closeModal();
        });

        /* ============================
           HELPER: GMT TIMESTAMP
        ============================ */
        const getGMTTimestamp = () => {
            const now = new Date();
            return now.toISOString().replace("T", " ").replace("Z", " GMT");
        };

        /* ============================
           FORM SUBMISSION TO SHEETDB
        ============================ */
        helloForm.addEventListener("submit", async e => {
            e.preventDefault();

            const requiredFields = helloForm.querySelectorAll("[required]");
            let isValid = true;

            requiredFields.forEach(field => {
                field.classList.remove("show-error");
                if (!field.value.trim()) {
                    field.classList.add("show-error");
                    isValid = false;
                }
            });

            if (!isValid) {
                helloStatus.textContent = "Please fill all required fields.";
                return;
            }

            helloStatus.textContent = "Sending message…";

            const fd = new FormData(helloForm);

            const payload = {
                data: [
                    {
                        name: fd.get("name"),
                        email: fd.get("email"),
                        number: fd.get("number"),
                        message: fd.get("message"),
                        date: getGMTTimestamp()
                    }
                ]
            };

            try {
                const res = await fetch(
                    "https://sheetdb.io/api/v1/pohadeba9icae",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    }
                );

                if (!res.ok) throw new Error("Request failed");

                helloStatus.textContent = "Message sent successfully! 🎉";
                helloForm.reset();

                setTimeout(() => {
                    closeModal();
                    helloStatus.textContent = "";
                }, 2000);

            } catch (err) {
                helloStatus.textContent =
                    "Something went wrong. Please try again later.";
            }
        });
    }
});
