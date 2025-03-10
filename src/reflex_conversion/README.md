
# Automation Conductor - Reflex Python Conversion

This is a conversion of the React/TypeScript Automation Conductor application to Reflex Python.

## Getting Started

1. Install the required packages:

```bash
pip install -r requirements.txt
```

2. Set up your Dataverse connection by creating a `.env` file in the project root with the following variables:

```
# Dataverse Connection Settings
DATAVERSE_URL=https://your-org.crm.dynamics.com
DATAVERSE_API_VERSION=9.2
DATAVERSE_AUTH_TYPE=oauth  # or "key"

# If using OAuth authentication
DATAVERSE_CLIENT_ID=your-client-id
DATAVERSE_CLIENT_SECRET=your-client-secret
DATAVERSE_TENANT_ID=your-tenant-id

# If using API Key authentication
DATAVERSE_API_KEY=your-api-key
```

3. Run the development server:

```bash
reflex run
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `main.py`: Main application file containing the layout, navbar, sidebar, and footer components
- `dataverse_connection.py`: Module for connecting to Microsoft Dataverse and handling data mapping
- Additional files will be added as more components are converted

## Features

- Responsive layout with sidebar navigation
- Mobile menu for small screens
- Theme customization similar to the original Tailwind implementation
- State management for UI interactions
- Microsoft Dataverse connectivity for data storage

## Next Steps

The conversion is in progress. The following components still need to be converted:
- Machines page
- Processes page
- Machine detail page
- Add machine form
- Add process form
- Assign process form
