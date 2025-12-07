
// Get DOM elements
const toggleBtn = document.getElementById("toggleBtn");
const sidebar = document.getElementById("sidebar");
const navLabels = document.querySelectorAll(".nav-label");
const dotNav = document.getElementById("dotNav");
const navigation = document.getElementById("navigation");
const dotButtons = document.querySelectorAll("#dotNav button");
const sections = document.querySelectorAll("section");
const scrollContainer = document.getElementById("scrollContainer");
const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");

// State tracking
let isOpen = false;           // Sidebar state (open/close)
let currentIndex = 0;         // Current visible section index

// Toggle sidebar and animate hamburger icon
toggleBtn.addEventListener("click", () => {
  isOpen = !isOpen;

  // Toggle icon animation
  toggleBtn.classList.toggle("menu-open");

if (isOpen) {
    // Expand sidebar
    sidebar.classList.remove("w-20", "max-sm:h-fit","max-sm:bg-transparent");
    sidebar.classList.add("w-60", "max-sm:h-full","max-sm:bg-[#FBFBFB]");
    dotNav.style.width = "200px";

    // Show nav labels after delay for smooth fade-in
    setTimeout(() => {
        navLabels.forEach(label => {
            label.classList.remove("hidden");
            label.classList.add("visible");
        });
    }, 300);

    // Remove mobile hidden classes
    dotNav.classList.remove("max-sm:hidden");
    navigation.classList.remove("max-sm:hidden");

} else {
    // Collapse sidebar
    sidebar.classList.remove("w-60", "max-sm:h-full","max-sm:bg-[#FBFBFB]");
    sidebar.classList.add("w-20", "max-sm:h-fit","max-sm:bg-transparent");
    dotNav.style.width = "";

    // Hide nav labels smoothly
    navLabels.forEach(label => {
        label.classList.remove("visible");
        setTimeout(() => label.classList.add("hidden"), 500);
    });

    // Add mobile hidden classes
    dotNav.classList.add("max-sm:hidden");
    navigation.classList.add("max-sm:hidden");
}

});

// Scroll to section when a dot is clicked
dotButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const index = parseInt(btn.getAttribute("data-index"));
    scrollToSection(index);
  });
});

// Scroll using up/down buttons
upBtn.addEventListener("click", () => scrollToSection(currentIndex - 1));
downBtn.addEventListener("click", () => scrollToSection(currentIndex + 1));

// Smooth scroll to section by index
function scrollToSection(index) {
  if (index >= 0 && index < sections.length) {
    sections[index].scrollIntoView({ behavior: "smooth" });
    currentIndex = index;
    updateActiveDot();
  }
}

// Update dot progress: fill up to current section
function updateActiveDot() {
  dotButtons.forEach((btn, idx) => {
    const dot = btn.querySelector("span");
    if (!dot) return;

    if (idx <= currentIndex) {
      // Fill current and previous
      dot.classList.add("bg-[var(--green)]");
      dot.classList.remove("border", "border-bg-[var(--green)]");
    } else {
      // Hollow for upcoming
      dot.classList.remove("bg-[var(--green)]");
      dot.classList.add("border", "border-bg-[var(--green)]");
    }
  });
}

// Detect scroll to determine active section
scrollContainer.addEventListener("scroll", () => {
  sections.forEach((section, idx) => {
    const rect = section.getBoundingClientRect();
    if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
      currentIndex = idx;
      updateActiveDot();
    }
  });
});





var options = {
  series: [21.6], // your desired percentage
  chart: {
    height: 350,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '70%',
      },
      dataLabels: {
        name: {
          show: false
        },
        value: {
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#e5e7eb',
          show: true,
          style: {
            direction: 'rtl',
            textAlign: 'right'
          },
          formatter: function (val) {
            return "%" + val;
          }
        }
      },
      track: {
        strokeWidth: '100%',
      }
    }
  },
  stroke: {
    lineCap: 'round'
  },
  labels: [''], // no label
  colors: ['#00A058'] // green ring
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();






  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optionally unobserve after revealing once
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: document.getElementById('dashboard'), // scrollable container
      threshold: 0.1 // trigger when 10% visible
    }
  );

  document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
  }
);


document.addEventListener("DOMContentLoaded", function() {
  gsap.registerPlugin(ScrollTrigger);

  const scroller = document.getElementById("scrollContainer");
  if (!scroller) return;

  // Set up ScrollTrigger for custom container
  ScrollTrigger.scrollerProxy(scroller, {
    scrollTop(value) {
      return arguments.length ? (scroller.scrollTop = value) : scroller.scrollTop;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    }
  });

  // Function to animate a single progress bar container
  function animateBar(container) {
    if (container.dataset.scrolltriggerInitialized) return;
    container.dataset.scrolltriggerInitialized = "true";

    const bar = container.querySelector(".progress-bar");
    const counterEl = container.querySelector(".progress-counter");
    const targetWidth = bar.getAttribute("data-width");
    const targetNumber = parseFloat(bar.getAttribute("data-number")); // allow decimals
    const prefix = counterEl.getAttribute("data-prefix") || "";
    const suffix = counterEl.getAttribute("data-suffix") || "";
    let counter = { val: 0 };

    // Animate bar width
    gsap.to(bar, {
      width: targetWidth,
      duration: 4,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        scroller: scroller,
        start: "top 95%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate counter with prefix/suffix and decimals
    gsap.to(counter, {
      val: targetNumber,
      duration: 2,
      ease: "power3.out",
      onUpdate: () => {
        // Show 1 decimal if the number is not whole
        const displayNumber = Number.isInteger(counter.val) ? 
                              Math.floor(counter.val) : 
                              counter.val.toFixed(1);
        counterEl.textContent = prefix + displayNumber + suffix;
      },
      scrollTrigger: {
        trigger: container,
        scroller: scroller,
        start: "top 95%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // IntersectionObserver to detect bars when they appear
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateBar(entry.target);
      }
    });
  }, {
    root: scroller,
    threshold: 0.1
  });

  // Observe all existing bars
  document.querySelectorAll(".progress-bar-container").forEach(container => {
    observer.observe(container);
  });

  // Function to observe newly added slides
  function observeNewSlide(slideEl) {
    slideEl.querySelectorAll(".progress-bar-container").forEach(container => {
      observer.observe(container);
    });
  }

  // Refresh ScrollTrigger after load
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
});



// Tooltip feature for progress bars
document.querySelectorAll(".progress-bar-container").forEach(container => {
  const bar = container.querySelector(".progress-bar");
  const counterEl = container.querySelector(".progress-counter");
  const prefix = counterEl.getAttribute("data-prefix") || "";
  const suffix = counterEl.getAttribute("data-suffix") || "";
  let tooltip = container.querySelector(".progress-tooltip");

  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "progress-tooltip absolute bg-black/80 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-2xl pointer-events-none opacity-0 scale-95 transform transition-all duration-300 ease-out shadow-xl z-50";
    container.appendChild(tooltip);
  }

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const barWidth = bar.offsetWidth;
    if (x >= 0 && x <= barWidth) {
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y - 25}px`; // 25px above cursor
      tooltip.textContent =counterEl.textContent; // show animated value
      tooltip.style.opacity = 1;
    } else {
      tooltip.style.opacity = 0;
    }
  });

  container.addEventListener("mouseleave", () => {
    tooltip.style.opacity = 0;
  });
});



// number-counter 

gsap.registerPlugin(ScrollTrigger);

const scroller = document.getElementById("scrollContainer");
const counters = document.querySelectorAll(".counter");

function animateCounter(counter) {
  const endValue = parseFloat(counter.dataset.count || counter.dataset.counter);
  const before = counter.dataset.before || "";
  const after = counter.dataset.after || "";
  const decimals = endValue % 1 !== 0;
  let counterObj = { val: 0 };

  gsap.to(counterObj, {
    val: endValue,
    duration: 1,
    ease: "power1.out",
    onUpdate: function () {
      let formattedValue;

      if (decimals) {
        formattedValue = counterObj.val.toFixed(1);
      } else {
        formattedValue = Math.floor(counterObj.val);
      }

      const isYear = formattedValue >= 1900 && formattedValue <= 2099;

      if (!isYear) {
        formattedValue = new Intl.NumberFormat("en-US").format(formattedValue);
      }

      counter.innerText = `${before}${formattedValue}${after}`;
    }
  });
}

counters.forEach(counter => {
  gsap.set(counter, { innerText: 0 });

  ScrollTrigger.create({
    trigger: counter,
    scroller: scroller,
    start: "top 80%",
    once: true,
    onEnter: () => {
      if (!counter.dataset.animated) {
        animateCounter(counter);
        counter.dataset.animated = "true";
      }
    }
  });
});






// chart animation

document.addEventListener('DOMContentLoaded', () => {
  const scroller = document.getElementById("scrollContainer");
  const observerOptions = {
    root: scroller || null,
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const chartEl = entry.target;
        renderChart(chartEl);
        observer.unobserve(chartEl);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.chart').forEach(chartEl => {
    observer.observe(chartEl);
  });

  function renderChart(chartEl) {
    const percent     = parseFloat(chartEl.dataset.percent) || 0;
    const color       = chartEl.dataset.color || '#14b8a6';
    const textColor   = chartEl.dataset.textColor || '#000000';
    const size        = Math.max(80, Number(chartEl.dataset.size || 220));
    const thickness   = Math.max(1, Number(chartEl.dataset.thickness || 12));
    const showLabel   = chartEl.dataset.label === 'true';
    const rounded     = chartEl.dataset.rounded === 'true';
    const customFont  = chartEl.dataset.fontSize ? chartEl.dataset.fontSize + 'px' : null;

    chartEl.style.width  = size + 'px';
    chartEl.style.height = size + 'px';
    chartEl.style.position = 'relative';
    chartEl.style.display = 'flex';
    chartEl.style.alignItems = 'center';
    chartEl.style.justifyContent = 'center';

    // Create overlay for counter text
    let overlay = chartEl.querySelector('.chart-value');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'chart-value';
      overlay.style.position = 'absolute';
      overlay.style.inset = '0';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.fontWeight = '700';
      overlay.style.pointerEvents = 'none';
      overlay.style.userSelect = 'none';
      chartEl.appendChild(overlay);
    }

    overlay.style.color = textColor;
    overlay.style.fontSize = customFont || (Math.max(10, Math.round(size * 0.18)) + 'px');
    overlay.style.opacity = showLabel ? '1' : '0';

    const computedHollowPct = Math.max(0, Math.min(98, (1 - (2 * thickness / size)) * 100));
    const hollowSizeStr = computedHollowPct.toFixed(2) + '%';

    const options = {
      series: [percent],
      chart: {
        type: 'radialBar',
        width: size,
        height: size,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1500,
          animateGradually: { enabled: true, delay: 200 }
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: 0,
          endAngle: 360,
          hollow: {
            size: hollowSizeStr,
            margin: 0,
            background: 'transparent'
          },
          track: {
            show: true,
            background: '#e5e7eb',
            width: thickness,
            opacity: 1,
            margin: 0
          },
          dataLabels: {
            show: false // We use our custom overlay instead
          }
        }
      },
      fill: {
        colors: [color]
      },
      stroke: {
        lineCap: rounded ? 'round' : 'butt'
      },
      tooltip: { enabled: false }
    };

    const chart = new ApexCharts(chartEl, options);
    chart.render();

    // Counter Animation
    if (showLabel) {
      const decimals = chartEl.dataset.percent.includes('.') ? chartEl.dataset.percent.split('.')[1].length : 0;
      animateCounter(overlay, 0, percent, 1500, decimals);
    }
  }

  function animateCounter(el, start, end, duration, decimals) {
    const startTime = performance.now();
    const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = ease(progress);
      const current = start + (end - start) * eased;
      el.textContent = '%' + (decimals > 0 ? current.toFixed(decimals) : Math.round(current));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
});
