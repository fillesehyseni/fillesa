(function () {
  const products = [
    {
      name: "Ujë i Thjeshte",
      size: "0.5 L",
      description: "Ujë pa gaz, i përshtatshëm për ta shijuar në shtëpi, ose gjatë ditës.",
      color: "#9fd8f5"
    },
    {
      name: "Ujë I Thjeshtë",
      size: "1.5 L",
      description: "Ujë i përshtatshëm për përdorim në shtëpi dhe për familje.",
      color: "#6cb9e8"
    },
    {
      name: "Ujë në Bidon",
      size: "5.0 L",
      description: "Ujë pa gaz në bidon, praktik për shtëpi dhe zyrë.",
      color: "#3d86d0"
    }
  ];

  function createBottle(color, index) {
    const shape = "M22 6h16v14c0 6 12 12 12 30v96a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V50c0-18 12-24 12-30Z";

    return '<svg viewBox="0 0 60 160" aria-hidden="true">' +
      '<defs>' +
        '<clipPath id="c' + index + '"><path d="' + shape + '"/></clipPath>' +
        '<linearGradient id="g' + index + '" x1="0" x2="1">' +
          '<stop offset="0" stop-color="#fff" stop-opacity=".9"/>' +
          '<stop offset=".5" stop-color="#fff" stop-opacity=".15"/>' +
          '<stop offset="1" stop-color="#fff" stop-opacity=".6"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="' + shape + '" fill="#fff" fill-opacity=".5" stroke="#0b4ea2" stroke-width="1.5"/>' +
      '<rect y="52" width="60" height="110" fill="' + color + '" opacity=".6" clip-path="url(#c' + index + ')"/>' +
      '<rect x="14" y="78" width="32" height="42" rx="3" fill="#fff" opacity=".92" clip-path="url(#c' + index + ')"/>' +
      '<rect width="60" height="160" fill="url(#g' + index + ')" clip-path="url(#c' + index + ')"/>' +
      '<rect x="21" y="2" width="18" height="8" rx="2" fill="#0b4ea2"/>' +
    '</svg>';
  }

  const productGrid = document.getElementById("grid");

  products.forEach(function (product, index) {
    const card = document.createElement("article");
    card.className = "card reveal d" + index;
    card.innerHTML =
      '<div class="bottle">' +
        createBottle(product.color, index) +
        '<div class="ph" role="img" aria-label="Optional product photo placeholder for ' + product.name + '">Product photo (optional)</div>' +
      '</div>' +
      '<h3>' + product.name + '</h3>' +
      '<p>' + product.description + '</p>' +
      '<div class="meta"><span>' + product.size + '</span><span></span></div>';
    productGrid.appendChild(card);
  });

  const menuButton = document.querySelector(".menu-btn");
  const navigation = document.getElementById("nav");
  const page = document.documentElement;

  function setMenuOpen(isOpen) {
    navigation.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  menuButton.addEventListener("click", function () {
    setMenuOpen(!navigation.classList.contains("open"));
  });

  navigation.addEventListener("click", function (event) {
    if (event.target.tagName === "A") setMenuOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && navigation.classList.contains("open")) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  function updateHeader() {
    page.classList.toggle("sc", scrollY > 40);
  }

  updateHeader();
  addEventListener("scroll", updateHeader, { passive: true });

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("in");
    });
  }

  const inquiryForm = document.getElementById("inq");
  const formStatus = inquiryForm.querySelector(".status");

  inquiryForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!inquiryForm.name.value.trim() ||
        !inquiryForm.email.validity.valid ||
        !inquiryForm.message.value.trim()) {
      formStatus.textContent = "Please add your name, a valid email and a message.";
      return;
    }

    const subject = encodeURIComponent("Dua Water inquiry");
    const body = encodeURIComponent(
      "Name: " + inquiryForm.name.value +
      "\nEmail: " + inquiryForm.email.value +
      "\n\n" + inquiryForm.message.value
    );

    location.href = "mailto:info@example.com?subject=" + subject + "&body=" + body;
    formStatus.textContent = "Thank you. Your email app should open with your message ready to send.";
  });

  const canvas = document.getElementById("drop");
  const context = canvas.getContext("2d");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width;
  let height;
  let impactX;
  let impactY;
  let animation;
  let isVisible = true;
  let drop;

  function resizeCanvas() {
    const pixelRatio = Math.min(devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    impactX = width > 860 ? width * 0.7 : width * 0.5;
    impactY = height * (width > 860 ? 0.7 : 0.62);
  }

  function resetDrop() {
    drop = { phase: "wait", next: 40, y: 0, velocity: 0, ripples: [], particles: [] };
  }

  function createSplash() {
    [0, 9, 20, 34].forEach(function (delay, index) {
      drop.ripples.push({
        radius: 0,
        alpha: 0.8 - index * 0.1,
        delay: delay,
        speed: 1.7 + index * 0.2
      });
    });

    drop.particles.push({ x: impactX, y: impactY, vx: 0, vy: -8.5, radius: 3.2, alpha: 1 });

    for (let index = 0; index < 12; index++) {
      const angle = Math.random() * Math.PI * 0.7 + Math.PI * 0.15;
      const direction = Math.random() < 0.5 ? -1 : 1;

      drop.particles.push({
        x: impactX,
        y: impactY,
        vx: Math.cos(angle) * (Math.random() * 3 + 1) * direction,
        vy: -(Math.random() * 5 + 2.5),
        radius: Math.random() * 1.4 + 0.8,
        alpha: 1
      });
    }
  }

  function updateDrop() {
    if (drop.phase === "wait") {
      if (--drop.next <= 0) {
        drop.phase = "fall";
        drop.y = -30;
        drop.velocity = 2;
      }
    } else if (drop.phase === "fall") {
      drop.velocity += 0.38;
      drop.y += drop.velocity;

      if (drop.y >= impactY) {
        drop.phase = "splash";
        createSplash();
      }
    } else if (!drop.ripples.length && !drop.particles.length) {
      drop.phase = "wait";
      drop.next = 70;
    }

    drop.ripples.forEach(function (ripple) {
      if (ripple.delay > 0) {
        ripple.delay--;
        return;
      }

      ripple.radius += ripple.speed;
      ripple.speed *= 0.992;
      ripple.alpha -= 0.0065;
    });
    drop.ripples = drop.ripples.filter(function (ripple) {
      return ripple.alpha > 0;
    });

    drop.particles.forEach(function (particle) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.32;
      particle.alpha -= 0.004;
    });
    drop.particles = drop.particles.filter(function (particle) {
      return particle.y <= impactY + 1 && particle.alpha > 0;
    });
  }

  function drawDrop() {
    context.clearRect(0, 0, width, height);

    const horizon = context.createLinearGradient(impactX - width * 0.4, 0, impactX + width * 0.4, 0);
    horizon.addColorStop(0, "rgba(159,216,245,0)");
    horizon.addColorStop(0.5, "rgba(159,216,245,.45)");
    horizon.addColorStop(1, "rgba(159,216,245,0)");
    context.fillStyle = horizon;
    context.fillRect(impactX - width * 0.4, impactY, width * 0.8, 1);

    const glow = context.createRadialGradient(impactX, impactY, 0, impactX, impactY, width * 0.3);
    glow.addColorStop(0, "rgba(159,216,245,.16)");
    glow.addColorStop(1, "rgba(159,216,245,0)");
    context.save();
    context.translate(impactX, impactY);
    context.scale(1, 0.26);
    context.fillStyle = glow;
    context.beginPath();
    context.arc(0, 0, width * 0.3, 0, 7);
    context.fill();
    context.restore();

    drop.ripples.forEach(function (ripple) {
      if (ripple.delay > 0) return;

      context.strokeStyle = "rgba(200,232,252," + ripple.alpha + ")";
      context.lineWidth = 1.2;
      context.beginPath();
      context.ellipse(impactX, impactY, ripple.radius, ripple.radius * 0.26, 0, 0, 7);
      context.stroke();
    });

    if (drop.phase === "fall") {
      const radius = 7;
      const stretch = Math.min(drop.velocity * 0.9, 14);
      const top = drop.y - radius - stretch;
      const gradient = context.createLinearGradient(0, top, 0, drop.y + radius);
      gradient.addColorStop(0, "rgba(255,255,255,.2)");
      gradient.addColorStop(1, "rgba(220,242,255,.95)");
      context.fillStyle = gradient;
      context.beginPath();
      context.moveTo(impactX, top - radius * 1.8);
      context.bezierCurveTo(impactX + radius * 0.5, top, impactX + radius, drop.y - radius, impactX + radius, drop.y);
      context.arc(impactX, drop.y, radius, 0, Math.PI);
      context.bezierCurveTo(impactX - radius, drop.y - radius, impactX - radius * 0.5, top, impactX, top - radius * 1.8);
      context.fill();
      context.fillStyle = "rgba(255,255,255,.9)";
      context.beginPath();
      context.ellipse(impactX - radius * 0.35, drop.y - radius * 0.2, radius * 0.18, radius * 0.4, 0, 0, 7);
      context.fill();
    }

    drop.particles.forEach(function (particle) {
      context.fillStyle = "rgba(225,244,255," + Math.min(particle.alpha, 0.9) + ")";
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, 7);
      context.fill();
    });
  }

  function animate() {
    updateDrop();
    drawDrop();
    animation = requestAnimationFrame(animate);
  }

  function startAnimation() {
    cancelAnimationFrame(animation);
    if (isVisible && !document.hidden && !reducedMotion) {
      animation = requestAnimationFrame(animate);
    }
  }

  resizeCanvas();
  resetDrop();

  if (reducedMotion) {
    drop.ripples = [0, 40, 80].map(function (delay, index) {
      return { radius: 60 + delay * 1.6, alpha: 0.5 - index * 0.12, delay: 0, speed: 0 };
    });
    drawDrop();
  }

  addEventListener("resize", function () {
    resizeCanvas();
    if (reducedMotion) drawDrop();
  });

  document.addEventListener("visibilitychange", startAnimation);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting;
      startAnimation();
    }).observe(canvas);
  } else {
    startAnimation();
  }

  startAnimation();
})();
