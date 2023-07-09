async function fetchUserId() {
    const response = await fetch('/api/users/getCurrentUser',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          },  
          });
    const data = await response.json();
  
    console.log(data.id);
    return data.id;
  }

export async function userData() {
    const userId = await fetchUserId();
    return (userId) 
  }