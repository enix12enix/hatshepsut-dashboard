export function getStatusInfo(status: string) {
  switch (status) {
    case "P":
      return { text: "Passed", class: "status-passed" };
    case "F":
      return { text: "Failed", class: "status-failed" };
    case "I":
    case "Ignored":
      return { text: "Ignored", class: "status-ignored" };
    default:
      return { text: status, class: "status-pending" };
  }
}