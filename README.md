# Workspace Shipping Dashboard

A modern, Superhuman-inspired shipping dashboard for managing orders with customer names, addresses, and tracking codes.

## Features

- **Modern UI Design**: Clean, professional interface inspired by Superhuman's design principles
- **Order Management**: Add, edit, and track shipping orders
- **Real-time Search**: Search orders by customer name, address, city, or tracking code
- **Status Tracking**: Track orders through pending, shipped, and delivered statuses
- **Multi-Carrier Tracking**: Real-time tracking status updates via Trackship API (UPS, FedEx, USPS, DHL, etc.)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Live Statistics**: Real-time order counts and status breakdowns

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Trackship API** for multi-carrier tracking
- **Modern ES6+** features

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Trackship API credentials (optional, for real tracking)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd workspace-shipping-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
cp env.example .env
# Edit .env with your Trackship API credentials
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

### Adding Orders
- Click the "Add Order" button in the header
- Fill in customer details, address, and tracking information
- Save the order to add it to your dashboard

### Managing Orders
- **Edit**: Click "Edit Order" on any order card
- **Status Updates**: Use the status dropdown to update order progress
- **Search**: Use the search bar to find specific orders
- **View Statistics**: See order counts by status in the header

### Order Information
Each order includes:
- Customer name and full address
- Tracking code (optional)
- Order date and estimated delivery
- Status (pending, shipped, delivered)
- Notes for additional information
- Real-time tracking updates (for all major carriers)

### Multi-Carrier Tracking Integration

The dashboard includes real-time tracking status updates for multiple carriers:

1. **Automatic Updates**: Tracking status is automatically fetched when orders have tracking numbers
2. **Multi-Carrier Support**: Supports UPS, FedEx, USPS, DHL, and other major carriers
3. **Manual Refresh**: Click the refresh button to update tracking information
4. **Status Mapping**: Carrier status codes are mapped to dashboard statuses (pending/shipped/delivered)
5. **Mock Mode**: Currently using mock data for demonstration (real API integration in progress)

**Note**: The tracking API integration is currently using mock data. To enable real tracking, you'll need to:
1. Sign up for a tracking API service (like TrackingMore, AfterShip, or similar)
2. Update the API endpoint and authentication in `src/services/trackshipApi.ts`
3. Configure your API credentials in `.env`

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Main header with search and stats
│   ├── OrderCard.tsx       # Individual order display card
│   └── OrderForm.tsx       # Add/edit order modal form
├── types.ts                # TypeScript type definitions
├── App.tsx                 # Main application component
├── index.tsx               # React entry point
└── index.css               # Global styles and Tailwind config
```

## Design Principles

This dashboard follows Superhuman's design philosophy:
- **Clean and Minimal**: Uncluttered interface with plenty of white space
- **Fast and Responsive**: Smooth animations and quick interactions
- **Information Hierarchy**: Clear visual hierarchy with proper typography
- **Consistent Spacing**: Systematic spacing using Tailwind's design tokens
- **Subtle Shadows**: Soft shadows for depth without being overwhelming

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:
- Primary colors for buttons and accents
- Success colors for shipped orders
- Warning colors for pending orders
- Gray scale for text and backgrounds

### Styling
All components use Tailwind CSS classes and custom component classes defined in `src/index.css`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. # workspacedash
