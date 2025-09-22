# Snippet Share - Frontend

This is the Vue.js frontend for the **Snippet Share** application, a platform for sharing code snippets.

**Note:** This frontend was developed as a client for a more complex backend project. The primary focus of the overall project is the backend functionality, including API design, database management, and business logic. The frontend is a functional but simple interface to interact with the backend services.

The corresponding backend project can be found here: **[Link to your backend project]**

---

## Features

*   **User Authentication:** Secure user registration and login.
*   **Snippet Management (CRUD):** Create, view, edit, and delete your code snippets.
*   **Dashboard:** A personalized view of all your created snippets.
*   **Explore Page:** Discover public snippets shared by the community.
*   **Advanced Filtering & Sorting:** Filter snippets by programming language and visibility. Sort them by creation date, title, or view count.
*   **Full-Text Search:** Quickly find snippets by searching through their content and title.
*   **Detailed Snippet View:**
    *   Syntax highlighting for various languages.
    *   Metadata including creator, creation date, language, and visibility.
    *   Copy-to-clipboard functionality.
*   **Snippet Analytics:** If you are the owner, you can view basic analytics like total views.
*   **Visibility Control:** Set your snippets to `public`  or `private`.
*   **Snippet Expiration:** Set an expiration date for your snippets.

---

## Tech Stack

This project is built with the following technologies:

*   **Framework:** [Vue.js](https://vuejs.org/) (v3) with the Composition API.
*   **Routing:** [Vue Router](https://router.vuejs.org/).
*   **State Management:** [Vuex](https://vuex.vuejs.org/).
*   **HTTP Client:** [Axios](https://axios-http.com/) for making API requests.
*   **Styling:** A utility-class based approach, with styles similar to frameworks like [Bulma CSS](https://bulma.io/).
*   **Syntax Highlighting:** [highlight.js](https://highlightjs.org/) integrated via a custom Vue directive.

---

## Project Setup

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ruldak/vue_snippet_share.git your_directory
    cd your_directory
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the project. Open the file and add the following line, pointing to the URL of your running backend API:
    ```
    VITE_API_BASE_URL=<your backend address>
    ```

### Running the Application

*   **Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

*   **Production Build:**
    ```bash
    npm run build
    ```
    This will create a `dist` folder with the optimized production assets.