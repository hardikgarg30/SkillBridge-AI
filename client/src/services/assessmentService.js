const API_URL = "http://127.0.0.1:8000";

function getLoggedInUser() {
  const storedUser = localStorage.getItem(
    "skillbridge_user"
  );

  if (!storedUser) {
    throw new Error(
      "Please login before continuing."
    );
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch {
    throw new Error(
      "Invalid login session. Please login again."
    );
  }

  if (!user?.access_token) {
    throw new Error(
      "Login session expired. Please login again."
    );
  }

  return user;
}


// ============================================================
// SUBMIT SKILL ASSESSMENT
// ============================================================

export async function submitAssessment(
  assessmentData
) {
  const user = getLoggedInUser();

  const response = await fetch(
    `${API_URL}/api/assessment/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.access_token}`,
      },

      body: JSON.stringify(
        assessmentData
      ),
    }
  );

  const result =
    await response.json().catch(
      () => null
    );

  if (
    !response.ok ||
    !result?.success
  ) {
    throw new Error(
      result?.message ||
      result?.detail ||
      "Failed to submit assessment"
    );
  }

  return result;
}


// ============================================================
// GENERATE AI MOCK TEST
// ============================================================

export async function generateMockTest(
  mockTestData
) {
  const user = getLoggedInUser();

  const response = await fetch(
    `${API_URL}/api/assessment/mock-test`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.access_token}`,
      },

      body: JSON.stringify(
        mockTestData
      ),
    }
  );

  const result =
    await response.json().catch(
      () => null
    );

  if (
    !response.ok ||
    !result?.success
  ) {
    throw new Error(
      result?.message ||
      result?.detail ||
      result?.error ||
      "Failed to generate AI mock test"
    );
  }

  return result;
}