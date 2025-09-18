# LuminPay1

LuminPay1 is a digital payments platform designed to enable fast, secure, and efficient transactions. With a modular and scalable architecture, it aims to provide innovative solutions within the digital financial ecosystem.

## 🚀 Installation

To get started with LuminPay1, follow these steps:

1. Clone the repository:

```bash
# Clone the repository
git clone https://github.com/deciderio/LuminPay1.git
cd LuminPay1

# Install dependencies
npm install

# Start the project
npm start
```

2. Arrange the project folders as follows:

```
LuminaPay/
├── src/
├── package.json
└── package-lock.json
└── index.html
```

3. # What is the problem?
- Integrating payment methods is often slow, expensive, and inflexible for small merchants.
- Payment experiences have friction that lead to cart abandonment.
- Difficulty adding new payment methods without rewriting the system.
- Lack of security and traceability in existing solutions.

4. # What is the solution?
- A modular and extensible platform that allows connecting new payment gateways via adapters.
- Embeddable checkout and a public API (REST/GraphQL) for integrations.

5. # Frontend
- HTML
- JavaScript

6. # Backend
- Node.js + Express/NestJS

7. # Benefits
- Fast and easy integration for merchants.
- Scalability thanks to its modular architecture.
- Lower maintenance and integration costs.
- Flexibility to add new payment methods (e.g., ILP / Open Payments).
- Improved security and regulatory compliance.
- Auditability and traceability for every transaction.

8. # Architecture
- Client (web / mobile)
- OpenPayments API (auth + rate limiting)
- Backend services
  - Payments (orchestrator)
  - Authentication

9. # Essential features (MVP)
- Registration and authentication for users/merchants.
- REST/GraphQL API to create payments.

10. # Team responsibilities
- **Product Manager:** roadmap, requirements, prioritization.  
- **Tech Lead / Architect:** architecture design, standards, and security.  
- **Backend Engineers (1–2):** API, orchestrator, DB, adapters (Stripe, ILP).  
- **Frontend Engineer (1):** dashboard and embeddable SDK (checkout).  
y SDK embebible (checkout).
