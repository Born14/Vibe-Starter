// Generate license keys without database insertion
function generateKey(): string {
  // Format: VS-XXXX-XXXX-XXXX (hex only: 0-9, A-F)
  const seg1 = Math.random().toString(16).substring(2, 6).toUpperCase().padEnd(4, '0');
  const seg2 = Math.random().toString(16).substring(2, 6).toUpperCase().padEnd(4, '0');
  const seg3 = Math.random().toString(16).substring(2, 6).toUpperCase().padEnd(4, '0');
  return `VS-${seg1}-${seg2}-${seg3}`;
}

console.log('\n=== Generated License Keys ===\n');
for (let i = 1; i <= 5; i++) {
  const key = generateKey();
  console.log(`${i}. ${key}`);
}
console.log('\n');
