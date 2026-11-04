// Native scrolling remains available without JavaScript; add left-mouse dragging.
const pricingRail = document.querySelector('.gp-pricing-rail');

if (pricingRail) {
  let drag = null;
  let suppressClick = false;

  const finishDrag = () => {
    if (!drag) return;
    const { pointerId, moved } = drag;
    drag = null;
    suppressClick = moved;
    pricingRail.classList.remove('is-dragging');
    if (pricingRail.hasPointerCapture(pointerId)) pricingRail.releasePointerCapture(pointerId);
  };

  pricingRail.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    if (event.target.closest('a, button, input, select, textarea, [contenteditable]')) return;
    suppressClick = false;
    drag = { pointerId: event.pointerId, x: event.clientX, scrollLeft: pricingRail.scrollLeft, moved: false };
    pricingRail.setPointerCapture(event.pointerId);
    pricingRail.classList.add('is-dragging');
    pricingRail.focus({ preventScroll: true });
    event.preventDefault();
  });

  pricingRail.addEventListener('pointermove', (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!(event.buttons & 1)) return finishDrag();
    const distance = event.clientX - drag.x;
    if (Math.abs(distance) > 4) drag.moved = true;
    pricingRail.scrollLeft = drag.scrollLeft - distance;
  });

  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((name) => {
    pricingRail.addEventListener(name, finishDrag);
  });
  window.addEventListener('blur', finishDrag);
  pricingRail.addEventListener('dragstart', (event) => event.preventDefault());
  pricingRail.addEventListener('keydown', (event) => {
    if (event.target !== pricingRail) return;
    const step = Math.min(pricingRail.clientWidth * .8, 380);
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      pricingRail.scrollBy({ left: event.key === 'ArrowRight' ? step : -step, behavior: 'auto' });
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      pricingRail.scrollTo({ left: event.key === 'Home' ? 0 : pricingRail.scrollWidth, behavior: 'auto' });
    }
  });
  pricingRail.addEventListener('click', (event) => {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);
}
