const { registerPaymentMethod } = window.wc.wcBlocksRegistry;
const { createElement } = window.wp.element;

// Add this function to inject our CSS
const injectGwepayStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .gwepay-heading {
            font-size: 1.5em;
            color: #000;
            margin: 0.1em 0;
            text-align: left;
        }
    `;
    document.head.appendChild(style);
};

const GwepayComponent = () => {
    return createElement('h2', 
        { className: 'gwepay-heading' }, 
        'Pay with Gwepay'
    );
};

// Call this function to inject the styles
injectGwepayStyles();

registerPaymentMethod({
    name: 'gwepay',
    label: 'Gwepay',
    content: createElement(GwepayComponent, null),
    edit: createElement(GwepayComponent, null),
    canMakePayment: () => true,
    ariaLabel: 'Pay with Gwepay heading',
    supports: {
        features: ['products', 'refunds'],
    },
});
