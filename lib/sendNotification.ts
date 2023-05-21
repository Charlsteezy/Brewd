export async function sendNotification(authorId: string | undefined, title:string, message: string, postId: string) {
    await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        authorId: authorId,
        title: title,
        message: message,
        url: postId
      }),
    });
  }