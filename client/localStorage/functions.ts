import { toast } from "sonner";

export function saveCredentials(username, password) {
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);
  toast("Credentials successfully saved.");
}

export function getCredentials() {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  if (username && password) {
    return { username, password };
  }
  return null;
}

export function areCredentialsStored() {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  return !!(username && password);
}

export function clearCredentials() {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  if (username && password) {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    toast("Credentials successfully deleted.");
  } else {
    toast("You have no Credentials to delete");
  }
}
