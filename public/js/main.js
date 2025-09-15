// main.js
document.addEventListener('DOMContentLoaded', () => {

  // ===========================
  // ELEMENTOS DEL DOM
  // ===========================
  const ventana = document.getElementById('ventana');
  const ventana_fondo = document.querySelector('.ventana_fondo');
  const pase = document.getElementById('pase');
  const pantalla = document.querySelector('.pantalla-inicial');
  const persiana = document.querySelector(".persiana");
  const wrapper = document.querySelector(".wrapper");

  const avionAudio = document.getElementById('sounds-avionBienvenida');
  const avionCabina = document.getElementById('sounds-CabinaAvion');

  // Modal
  const modal = document.getElementById('modal');
  const btnAceptar = document.getElementById('btnAceptar');

  // WhatsApp
  const checkbox = document.getElementById("confirmCheck");
  const btnWhatsApp = document.getElementById("btnWhatsApp");

  // Invitado
  const nombreEl = document.getElementById('nombre');
  const vueloEl = document.getElementById('vuelo');
  const asientoEl = document.getElementById('asiento');
  const btnDescargar = document.getElementById('btn-descargar');

  // ===========================
  // HELPER: obtener id desde hash / query / path
  // ===========================
  function getIdFromUrl(){
    const fromHash = location.hash.replace(/^#\/?/, '');
    if (fromHash) return decodeURIComponent(fromHash);

    const q = new URLSearchParams(location.search).get('id');
    if (q) return q;

    const path = location.pathname.replace(/^\/+/, '').replace(/index\.html$/, '');
    if (path) return decodeURIComponent(path);

    return null;
  }

  const id = getIdFromUrl();
  console.log('id detectado:', id);

  // ===========================
  // CARGAR INVITADO
  // ===========================
  const invitado = Array.isArray(invitados) ? invitados.find(i => i.id === id) : null;

  if (invitado) {
    if (nombreEl) nombreEl.textContent = invitado.nombre;
    if (vueloEl) vueloEl.textContent = invitado.vuelo;
    if (asientoEl) asientoEl.textContent = invitado.asiento;
    if (btnDescargar && invitado.img) {
      btnDescargar.href = `img/invitaciones/${invitado.img}`;
      btnDescargar.setAttribute('download', invitado.img);
    }
  } else {
    if (nombreEl) nombreEl.textContent = "Invitado no encontrado";
    if (btnDescargar) btnDescargar.style.display = "none";
  }

  // ===========================
  // MOSTRAR MODAL
  // ===========================
  function abrirModal() {
    modal.classList.remove('hidden');
  }

  function cerrarModal() {
    modal.classList.add('hidden');
    avionAudio.play().catch(e => console.warn("Error al reproducir audio:", e));
    iniciarAnimaciones();
  }

  btnAceptar.addEventListener('click', cerrarModal);
  abrirModal();

  // ===========================
  // WHATSAPP
  // ===========================
  checkbox.addEventListener("change", () => {
    btnWhatsApp.disabled = !checkbox.checked;
    if(checkbox.checked) {
      avionCabina.play().catch(e => console.warn("Error al reproducir audio:", e));
    }
  });

  btnWhatsApp.addEventListener("click", () => {
    if (!invitado) return;
    const telefono = "529612385401";
    const mensaje = encodeURIComponent(`Hola, soy ${invitado.nombre} quiero confirmar mi asistencia.`);
    const url = `https://wa.me/${telefono}?text=${mensaje}`;
    window.open(url, "_blank");
  });

  // ===========================
  // ANIMACION DE NUBES
  // ===========================
  if (typeof gsap !== 'undefined') {
    gsap.defaults({ duration: 90, ease: "none" });
    const cloudContainer = document.getElementById("clouds-container");
    const numClouds = 15;

    function createCloud() {
      const cloud = document.createElement("img");
      cloud.src = "img/Cloud.png";
      cloud.className = "absolute opacity-80";

      const scale = gsap.utils.random(0.5, 1.5); 
      cloud.style.width = `${150 * scale}px`;
      cloud.style.height = "auto";
      cloud.style.top = `${gsap.utils.random(0, window.innerHeight - 100)}px`;
      cloud.style.left = `-${200 * scale}px`;
      cloud.style.opacity = gsap.utils.random(0.4, 0.9);

      cloudContainer.appendChild(cloud);
      animateCloud(cloud, scale);
    }

    function animateCloud(cloud, scale) {
      const speed = gsap.utils.random(60, 120);
      gsap.to(cloud, {
        x: window.innerWidth + 200 * scale,
        duration: speed,
        ease: "linear",
        onComplete: () => {
          cloud.remove();
          createCloud();
        }
      });
    }

    for (let i = 0; i < numClouds; i++) {
      setTimeout(createCloud, i * 1000);
    }

    gsap.set([".avion", ".logo", ".maleta1", ".maleta2", ".ventanaText", ".fecha", ".boleto"], { opacity: 0 });
  }

  // ===========================
  // FUNCION EFECTOS LETRAS
  // ===========================
  function efectosLetras() {
    const text = new SplitType(".textA", { types: 'chars' });
    gsap.fromTo(text.chars, { opacity: 0, y: 50, rotation: -45 }, { 
      opacity: 1, y: 0, rotation: 0, duration: 1, stagger: 0.05, ease: "back.out(1.7)",
      onComplete: () => {
        text.chars.forEach(char => {
          gsap.to(char, {
            x: () => gsap.utils.random(-2,2),
            y: () => gsap.utils.random(-2,2),
            rotation: () => gsap.utils.random(-5,5),
            duration: () => gsap.utils.random(0.5,1.5),
            repeat: -1, yoyo: true, ease: "sine.inOut",
            delay: () => gsap.utils.random(0,2)
          });
        });
      }
    });
  }

  // ===========================
  // FUNCION INICIAR ANIMACIONES
  // ===========================
  function iniciarScrollTrigger() {
    //ScrollTrigger.refresh();
    gsap.timeline({
      scrollTrigger: {
        trigger: ".wrapper",
        start: "top top",
        end: "100", // o +=3000
        pin: ".wrapper",
        scrub: 1
      }
    })
    .to(".efectoScroll", { scale: 25, z: 1000 })
    .to(".boleto", { scale: 0.9 }, "<")
    .to(".persiana", { yPercent: -1000 }, "<")
    
    .to(".boleto", { zIndex: 500 }) // sube mientras ocurre la animación
    .to(".boleto", { zIndex: 1 });  // baja después
    
  }


  function iniciarAnimaciones() {
    gsap.registerPlugin(ScrollTrigger);

    const introTimeline = gsap.timeline({ onComplete: iniciarScrollTrigger });

    introTimeline.fromTo(".avion", { x: 600, y: 30, opacity: 0 }, { x:0, y:30, opacity:1, duration: 6, ease:"power1.Out" });
    introTimeline.to(".avion", { y:3, repeat:-1, yoyo:true, duration:3, ease:"sine.inOut" }, "<");

    // introTimeline.fromTo(".logo", { y:-50, opacity:0 }, { y:0, opacity:1, duration:1, ease:"bounce.out" });
    // introTimeline.fromTo(".fecha", { y:50, opacity:0 }, { y:0, opacity:1, duration:1, ease:"bounce.out" });

    // gsap.to(".maleta1", { rotation:-10, y:15, repeat:-1, yoyo:true, ease:"sine.inOut", duration:2 } );
    // gsap.to(".maleta2", { rotation:15, y:-15, repeat:-1, yoyo:true, ease:"sine.inOut", duration:2 } );

    // gsap.fromTo(".avion", { x: 600, y: 30, opacity: 0 }, { x: 0, y: 30, opacity: 1, duration: 6, ease: "power1.Out" }); 
    // gsap.to(".avion", { y: 3, repeat: -1, yoyo: true, duration: 3, ease: "sine.inOut" }); 

    gsap.fromTo(".logo", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "bounce.out", delay: 6 }); 
    gsap.fromTo(".fecha", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "bounce.out", delay: 8 }); 
    
    gsap.to(".maleta1", { rotation: -10, y: 15, repeat: -1, yoyo: true, ease: "sine.inOut", duration: 4 }); 
    gsap.to(".maleta2", { rotation: 15, y: -15, repeat: -1, yoyo: true, ease: "sine.inOut", duration: 4 });

    gsap.fromTo(".ventanaText", { opacity:0 }, { 
      opacity:1, 
      duration:3, 
      delay: 7,
      ease:"power1.Out",
      onComplete: () => {
        gsap.fromTo(".boleto", { opacity:0 }, { opacity:1, duration:1, ease:"power1.Out" });
        iniciarScrollTrigger(); // 👈 aquí lo metes
      },
    });


    gsap.fromTo(".maleta1", { x:400, opacity:0 }, { x:0, opacity:1, duration:4, ease:"power2.out", delay:6});
    gsap.fromTo(".maleta2", { x:-200, opacity:0 }, { x:0, opacity:1, duration:2, ease:"power2.out", delay:6});

    efectosLetras();

  }


  simplyCountdown('#cuenta', {
      year: 2025, // required
      month: 10, // required
      day: 18, // required
      hours: 10, // Default is 0 [0-23] integer
      minutes: 0, // Default is 0 [0-59] integer
      seconds: 0, // Default is 0 [0-59] integer
      words: { //words displayed into the countdown
          days: { singular: 'Día', plural: 'Días' },
          hours: { singular: 'Hrs', plural: 'Hrs' },
          minutes: { singular: 'Min', plural: 'Min' },
          seconds: { singular: 'Seg', plural: 'Seg' }
      },
      plural: true, //use plurals
      inline: false, //set to true to get an inline basic countdown like : 24 days, 4 hours, 2 minutes, 5 seconds
      inlineClass: 'simply-countdown-inline', //inline css span class in case of inline = true
      // in case of inline set to false
      enableUtc: false, //Use UTC or not - default : false
      onEnd: function() { return; }, //Callback on countdown end, put your own function here
      refresh: 1000, // default refresh every 1s
      sectionClass: 'simply-section', //section css class
      amountClass: 'simply-amount', // amount css class
      wordClass: 'simply-word', // word css class
      zeroPad: false,
      countUp: false
  });


});




// // main.js
// document.addEventListener('DOMContentLoaded', () => {

//   // Elementos
//   const ventana = document.getElementById('ventana');
//   const ventana_fondo = document.querySelector('.ventana_fondo');
//   const pase = document.getElementById('pase');
//   const pantalla = document.querySelector('.pantalla-inicial');
//   const persiana = document.querySelector(".persiana");

//   // Creamos un objeto Audio
//   // const avionAudio = new Audio('sounds/avionBienvenida.mp3');
//   // const avionCabina = new Audio('sounds/CabinaAvion.mp3');

//   const avionAudio = document.getElementById('sounds-avionBienvenida');
//   const avionCabina = document.getElementById('sounds-CabinaAvion');

//   // Modal de bienvenida
//   // Seleccionamos modal y botón
//   const modal = document.getElementById('modal');
//   const btnAceptar = document.getElementById('btnAceptar');

//   const checkbox = document.getElementById("confirmCheck");
//   const btnWhatsApp = document.getElementById("btnWhatsApp");

//   // Helper: obtiene id desde hash / query / path (intenta en ese orden)
//   function getIdFromUrl(){
//     const fromHash = location.hash.replace(/^#\/?/, '');
//     if (fromHash) return decodeURIComponent(fromHash);

//     const q = new URLSearchParams(location.search).get('id');
//     if (q) return q;

//     const path = location.pathname.replace(/^\/+/, '').replace(/index\.html$/, '');
//     if (path) return decodeURIComponent(path);

//     return null;
//   }

//   const id = getIdFromUrl(); // ej: "luis"
//   console.log('id detectado:', id);

//   // Cargar invitado (asegúrate que data.js definió "invitados")
//   if (typeof invitados === 'undefined') {
//     console.error('data.js no cargado o variable "invitados" no existe');
//   }
//   const invitado = Array.isArray(invitados) ? invitados.find(i => i.id === id) : null;

//   // Mostrar datos si hay invitado
//   const nombreEl = document.getElementById('nombre');
//   const vueloEl = document.getElementById('vuelo');
//   const asientoEl = document.getElementById('asiento');

//   const btnDescargar = document.getElementById('btn-descargar');

//   // if (invitado) {
//   //   if (nombreEl) nombreEl.textContent = `Bienvenido, ${invitado.nombre}`;
//   //   if (vueloEl) vueloEl.textContent = `Vuelo: ${invitado.vuelo}`;
//   //   if (asientoEl) asientoEl.textContent = `Asiento: ${invitado.asiento}`;
//   // } else {
//   //   if (nombreEl) nombreEl.textContent = "Invitado no encontrado";
//   // }


//   if (invitado) {
//     if (nombreEl) nombreEl.textContent = invitado.nombre;
//     if (vueloEl) vueloEl.textContent = invitado.vuelo;
//     if (asientoEl) asientoEl.textContent = invitado.asiento;

//           // Asignar ruta de descarga
//           // if (btnDescargar && invitado.img) {
//           //     btnDescargar.href = `img/invitaciones/${invitado.img}`;
//           //     btnDescargar.setAttribute('download', invitado.img); // nombre del archivo
//           //   }
//   } else {
//     if (nombreEl) nombreEl.textContent = "Invitado no encontrado";
//     if (btnDescargar) btnDescargar.style.display = "none"; // ocultar botón si no hay invitado
//   }

//   // Animaciones básicas con GSAP
//   if (typeof gsap !== 'undefined') {

//     // Animación infinita para las nubes
//     // Configuración global GSAP
//     gsap.defaults({ duration: 90, ease: "none" });

//     const cloudContainer = document.getElementById("clouds-container");
//     const numClouds = 15; // Número de nubes que quieres generar dinámicamente

//     // Función para crear una nube
//     function createCloud() {
//       const cloud = document.createElement("img");
//       cloud.src = "img/Cloud.png";
//       cloud.className = "absolute opacity-80";

//       // Tamaño aleatorio (escala)
//       const scale = gsap.utils.random(0.5, 1.5); 
//       cloud.style.width = `${150 * scale}px`; // base 150px
//       cloud.style.height = "auto";

//       // Posición inicial aleatoria en Y (toda la altura de la pantalla)
//       const startY = gsap.utils.random(0, window.innerHeight - 100);
//       cloud.style.top = `${startY}px`;

//       // Posición inicial en X (fuera a la izquierda)
//       cloud.style.left = `-${200 * scale}px`;

//       // Opacidad aleatoria
//       cloud.style.opacity = gsap.utils.random(0.4, 0.9);

//       cloudContainer.appendChild(cloud);

//       animateCloud(cloud, scale);
//     }

//     // Animar nube
//     function animateCloud(cloud, scale) {
//       const speed = gsap.utils.random(60, 120); // velocidad en segundos

//       gsap.to(cloud, {
//         x: window.innerWidth + 200 * scale, // hasta más allá de la pantalla
//         duration: speed,
//         ease: "linear",
//         onComplete: () => {
//           // Resetear la nube al terminar
//           cloud.remove();
//           createCloud();
//         }
//       });
//     }

//     // Generamos las nubes iniciales
//     for (let i = 0; i < numClouds; i++) {
//       setTimeout(createCloud, i * 1000); // las lanzamos con un delay escalonado
//     }

//     gsap.from(".modalEfecto", { y: -50, opacity: 0, duration: 1, ease: "bounce.out", delay: 1 });

//     // Ocultar elementos al inicio
//     gsap.set([".avion", ".logo", ".maleta1", ".maleta2", ".ventanaText", ".fecha", ".boleto"], { opacity: 0 });

//   } else {
//     console.warn('GSAP no encontrado, saltando animaciones.');
//   }

//   // Efectos de letras con SplitType y GSAP
//   function efectosLetras(){
//     // Separa el texto por letras
//     const text = new SplitType(".textA", { types: 'chars' });

//     // Animación inicial de entrada
//     gsap.fromTo(text.chars, 
//       { opacity: 0, y: 50, rotation: -45 }, 
//       { 
//         opacity: 1, 
//         y: 0, 
//         rotation: 0, 
//         duration: 1, 
//         stagger: 0.05,
//         ease: "back.out(1.7)",
//         onComplete: () => infiniteAnimation()
//       }
//     );

//     // Función para animación infinita
//     function infiniteAnimation() {
//       text.chars.forEach(char => {
//         gsap.to(char, {
//           x: () => gsap.utils.random(-2, 2), // movimiento horizontal aleatorio
//           y: () => gsap.utils.random(-2, 2), // movimiento vertical aleatorio
//           rotation: () => gsap.utils.random(-5, 5), // rotación aleatoria
//           duration: () => gsap.utils.random(0.5, 1.5),
//           repeat: -1, // infinito
//           yoyo: true, // va y vuelve
//           ease: "sine.inOut",
//           delay: () => gsap.utils.random(0, 2) // pequeño delay inicial
//         });
//       });
//     }
//   }



//   if (!ventana) {
//     console.error('Elemento #ventana no encontrado en DOM');
//     return;
//   }
//   if (!pase) {
//     console.error('Elemento #pase no encontrado en DOM');
//   } else {
//     // Asegurar estado inicial
//     pase.classList.add('hidden');
//     pase.style.opacity = 0;
//   }

//   // Asegurar que la ventana reciba clicks (en caso de estilos que lo bloqueen)
//   ventana.style.pointerEvents = 'auto';
//   ventana.style.zIndex = 30;

//   // Handler para abrir
//   let opened = false;
//   function openVentana(e) {
//     e.preventDefault && e.preventDefault();
//     if (opened) return;
//     opened = true;

//     //animación de la ventana (flip / zoom)
//     if (typeof gsap !== 'undefined') {
//       const tl = gsap.timeline();
//       // tl.to(ventana, { duration: 0.8, scale: 0.9, rotationY: 180, ease: 'power2.inOut' })
//       //   .add(() => {
//       //     // mostrar pase (quita hidden)
//       //     if (pase) {
//       //       avionCabina.play().catch(e => console.warn("Error al reproducir el audio:", e));
//       //       pase.classList.remove('hidden');
//       //       gsap.fromTo(pase, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' });
//       //     }
//       //   }, '-=0.2');

//       // // opcional: desvanecer la pantalla inicial
//       // if (pantalla) {
//       //   tl.to(pantalla, { duration: 0.6, autoAlpha: 0 }, '-=0.6');
//       // }
//     } else {
//       // Fallback simple sin GSAP
//       if (pase) pase.classList.remove('hidden');
//     }
//   }

//   // Soportar click y touch
//   ventana_fondo.addEventListener('click', openVentana);
//   ventana_fondo.addEventListener('touchstart', openVentana, { passive: true });

//   // Inicializar AOS si existe
//   if (typeof AOS !== 'undefined') {
//     AOS.init();
//   }



//   // const ventana = document.querySelector(".ventana");

//   // let startY = 0;
//   // let dragging = false;
//   // let currentY = 0;

//   // const maxY = 0; // cerrada (abajo del todo)
//   // const minY = -ventana.offsetHeight + 50; // abierta (dejando 40px visible)

//   // function startDrag(y) {
//   //   dragging = true;
//   //   startY = y;
//   // }

//   // function moveDrag(y) {
//   //   if (!dragging) return;

//   //   let deltaY = y - startY;
//   //   let newY = currentY + deltaY;

//   //   // limitar movimiento
//   //   newY = Math.max(minY, Math.min(maxY, newY));

//   //   gsap.to(persiana, {
//   //     y: newY,
//   //     duration: 0.1,
//   //     ease: "none"
//   //   });
//   // }

//   // function endDrag() {
//   //   if (dragging) {
//   //     currentY = gsap.getProperty(persiana, "y");
//   //   }
//   //   dragging = false;
//   // }

//   // --- Eventos para PC ---
//   // persiana.addEventListener("mousedown", (e) => startDrag(e.clientY));
//   // window.addEventListener("mousemove", (e) => moveDrag(e.clientY));
//   // window.addEventListener("mouseup", endDrag);

//   // --- Eventos para móvil (touch) ---
//   // persiana.addEventListener("touchstart", (e) => startDrag(e.touches[0].clientY));
//   // window.addEventListener("touchmove", (e) => {
//   //   moveDrag(e.touches[0].clientY);
//   // }, { passive: false });
//   // window.addEventListener("touchend", endDrag);
  
//   // Función que ejecuta todas las animaciones de GSAP que quieres retrasar
// function iniciarAnimaciones() {

//   gsap.registerPlugin(ScrollTrigger);

//   // Timeline para animaciones iniciales
//   const introTimeline = gsap.timeline({
//     onComplete: iniciarScrollTrigger // cuando termine, activamos scroll
//   });

//   // Animaciones con aparición
//   introTimeline.fromTo(".avion", { x: 600, y: 30, opacity: 0 }, { x: 0, y: 30, opacity: 1, duration: 6, ease: "power1.Out" });
//   introTimeline.to(".avion", { y: 3, repeat: -1, yoyo: true, duration: 3, ease: "sine.inOut" }, "<");

//   introTimeline.fromTo(".logo", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "bounce.out", });
//   introTimeline.fromTo(".fecha", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "bounce.out", });

//   introTimeline.to(".maleta1", { rotation: -10, y: 15, repeat: -1, yoyo: true, ease: "sine.inOut", duration: 4 }, "<");
//   introTimeline.to(".maleta2", { rotation: 15, y: -15, repeat: -1, yoyo: true, ease: "sine.inOut", duration: 4 }, "<");

//   introTimeline.fromTo(".ventanaText", { opacity: 0 }, { 
//     opacity: 1, duration: 3, ease: "power1.Out", 
//     onComplete: () => {
//       gsap.fromTo(".boleto", { opacity: 0 }, { opacity: 1, duration: 1, ease: "power1.Out", });
//     } 
//   });

//   introTimeline.set(".persiana", { y: 0 });

//   introTimeline.fromTo(".maleta1", { x: 400, opacity: 0 }, { x: 0, opacity: 1, duration: 4, ease: "power2.out", });
//   introTimeline.fromTo(".maleta2", { x: -200, opacity: 0 }, { x: 0, opacity: 1, duration: 2, ease: "power2.out", });

//   efectosLetras();

//   // Función que inicia el ScrollTrigger después de las animaciones
//   function iniciarScrollTrigger() {
//     gsap.timeline({
//       scrollTrigger: {
//         trigger: ".wrapper",
//         start: "top top",
//         end: "+=100%",
//         pin: ".wrapper",
//         scrub: true,
//         // markers: true
//       }
//     })
//     .to(".efectoScroll", { scale: 25, z: 1500 })
//     .to(".boleto", { scale: 4 }, "<")
//     .to(".persiana", { yPercent: -100 }, "<");
//   }
// }


//   // Mostrar modal al cargar
//   window.addEventListener('load', () => {
//     modal.classList.remove('hidden');
//   });

//   // Cerrar modal y lanzar animaciones al aceptar
//   btnAceptar.addEventListener('click', () => {
//     modal.classList.add('hidden');
    
//     // Reproducimos el audio
//     avionAudio.play().catch(e => console.warn("Error al reproducir el audio:", e));
    
//     iniciarAnimaciones(); // Aquí se ejecutan las animaciones
//   });

//   checkbox.addEventListener("change", function () {
//     btnWhatsApp.disabled = !this.checked; // habilita si está marcado
//   });

//   btnWhatsApp.addEventListener("click", function () {
//     const telefono = "529612385401";
//     const mensaje = encodeURIComponent(`Hola, soy ${invitado.nombre} quiero confirmar mi asistencia.`);
//     const url = `https://wa.me/${telefono}?text=${mensaje}`;
//     window.open(url, "_blank");
//   });





//         // .to(".persiana", { y: -ventana.offsetHeight + 50, ease: "none" }) // abre la persiana
//       // .to(".ventanaText", { opacity: 0, duration: 0.5 }, "-=0.5") // desvanece el texto
//       // .to(".maleta1", { x: -200, rotation: -30, opacity: 0, duration: 1, ease: "power2.in" }, "-=1")
//       // .to(".maleta2", { x: 200, rotation: 30, opacity: 0, duration: 1, ease: "power2.in" }, "-=1")
//       // .to(".fecha", { y: 50, opacity: 0, duration: 1, ease: "power2.in" }, "-=1")
//       // .to(".logo", { y: -50, opacity: 0, duration: 1, ease: "power2.in" }, "-=1")
//       // .to(".avion", { x: 600, opacity: 0, duration: 3, ease: "power2.in" }, "-=1")


//   // Cuando el usuario hace clic en la flecha, desaparece
//   // persiana.addEventListener('click', () => {
//   //   persiana.classList.remove('scroll-indicator');
//   // });

// });


