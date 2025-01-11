# AsgatechAssesment

### Prerequisites

Node.js: Ensure that Node.js is installed on your local machine. You can download it from nodejs web site.
Git: Ensure that Git is installed on your machine to manage source control.

### Installation

1.Clone the repository:
git clone <repository-url>
cd <project-directory>

2.Install dependencies:
npm install

3.Start the application:
npm run start

### The application will now be running at http://localhost:4200.

### Project Structure

The project contains the following structure:
src/
├── pages/
│ ├── Products # Displays a list of products.
│ ├── Orders # Displays a list of orders.
│ ├── new-order # Display new arder details.
│ └── Order-details # Displays individual order details.
├── services/
│ ├── productService.js # Handles product-related API calls.
│ ├── orderService.js # Handles order-related API calls.
│ ├── customerService.js # Handles customer-related API calls.
└── styles.scss #Contains global styles.

public/
├── data/
│ ├── products.json # JSON file containing products data.
│ ├── orders.json # JSON file containing orders data.
│ └── customers.json # JSON file containing customers data.
└──
