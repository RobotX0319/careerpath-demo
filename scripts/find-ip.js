// Simple script to find all network interfaces and IP addresses
const os = require('os');
const interfaces = os.networkInterfaces();

console.log('\n🌐 NETWORK INTERFACES & IP ADDRESSES:\n');

// Loop through all network interfaces
Object.keys(interfaces).forEach((interfaceName) => {
  const addresses = interfaces[interfaceName];
  
  console.log(`📡 Interface: ${interfaceName}`);
  
  // Loop through all addresses for this interface
  addresses.forEach((address) => {
    if (address.family === 'IPv4') {
      console.log(`   ▸ IPv4: ${address.address}${address.internal ? ' (internal)' : ' (external)'}`);
      
      // Highlight the most likely LAN IP for local development
      if (!address.internal && address.address.startsWith('192.168.')) {
        console.log(`     ✅ ACCESS URL: http://${address.address}:3000`);
      }
    } else {
      console.log(`   ▸ IPv6: ${address.address}${address.internal ? ' (internal)' : ' (external)'}`);
    }
  });
  
  console.log(''); // Empty line for better readability
});

console.log('✨ Tip: Use the highlighted URL to access your app from other devices');
console.log('   on the same network (phones, tablets, other computers)');
console.log('\n🚀 Local development URLs:');
console.log('   • http://localhost:3000');
console.log('   • http://127.0.0.1:3000\n');