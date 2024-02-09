async function fetchOMDBData(imdbID, apiKey) {
    const apiUrl = `http://www.omdbapi.com/?s=${imdbID}&movieTitle=${apiKey}&y=2024&r=json`;
  
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during data fetch:', error);
      throw error; // Propagate the error up to the caller
    }
  }
  
  // Example usage
  (async function () {
    try {
      const imdbID = 'tt';
      const apiKey = 'ebba7249';
  
      const data = await fetchOMDBData(imdbID,apiKey);
      console.log('Data:', data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Handle the error as needed
    }
  })();


