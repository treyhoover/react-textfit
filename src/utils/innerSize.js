// Calculate height without padding.
export function innerHeight(el) {
    const style = window.getComputedStyle(el, null);
    const paddingTop = parseInt(style.getPropertyValue('padding-top'), 10);
    const paddingBottom = parseInt(style.getPropertyValue('padding-bottom'), 10);

    return el.clientHeight - paddingTop - paddingBottom;
}

// Calculate width without padding.
export function innerWidth(el) {
    const style = window.getComputedStyle(el, null);
    const paddingLeft = parseInt(style.getPropertyValue('padding-left'), 10);
    const paddingRight = parseInt(style.getPropertyValue('padding-right'), 10);

    return el.clientWidth - paddingLeft - paddingRight;
}
