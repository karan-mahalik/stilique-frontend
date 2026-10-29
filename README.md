# Stilique — E-commerce Frontend

**🌐 Professional portfolio:** [Karan Mahalik — Data Analyst & Power BI Developer](https://karan-mahalik-portfolio.vercel.app/)

A React/Vite storefront project with product browsing, filtering, product detail views, cart and checkout-related screens, account workflows and a backend API integration.

**Career relevance:** Demonstrates how structured product, customer, and cart data is presented to users through an application. This is a **full-stack supporting project**, not a Power BI or SQL analytics dashboard.

## Stack

- React, React Router, JavaScript, CSS
- Axios for API requests
- React Icons
- Spring Boot/MySQL companion backend: [stilique-backend](https://github.com/karan-mahalik/stilique-backend)

## Repository structure

- `src/App.jsx`: routes and navigation guards
- `src/ProductList/`: product/category views and filters
- `src/Context/CartContext.jsx`: cart state
- `src/config.js`: configured API endpoint
- `src/data/mockData.js`: local example product data

## Run locally

Requirements: Node.js and npm.

```bash
git clone https://github.com/karan-mahalik/stilique-frontend.git
cd stilique-frontend
npm install
npm run dev
```

The API address currently lives in `src/config.js`. Some functionality may require a separately configured, reachable backend. The frontend has not been runtime-tested as part of this documentation update.

```bash
npm run build
npm run lint
```

These are available project scripts, **not claims that checks have passed**.

## Documentation and setup notes

- Add screenshots only after capturing them from an actual working build.
- Avoid committing passwords, API secrets or customer data.
- The backend repository currently requires a **security review of committed secrets** before any new deployment. Rotate potentially exposed credentials and replace source-controlled secrets with environment configuration.
- The companion backend README calls the application **Modamart**, while this repository is called **Stilique**. Naming should be reconciled after confirming the intended product name.

## Author

[Karan Mahalik](https://github.com/karan-mahalik) · [LinkedIn](https://www.linkedin.com/in/karan-mahalik-122438369/)
