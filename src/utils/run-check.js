import './system-check.js';

// Run the system check
runSystemCheck().then(results => {
  console.log('System check completed!');
  console.log('Results:', results);
}).catch(error => {
  console.error('System check failed:', error);
});
