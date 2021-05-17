function playNotification(url: string) {
  const audio = new Audio(url);
  audio.play();
}

export { playNotification };
