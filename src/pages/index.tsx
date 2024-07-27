import {
    createBrowserRouter,
    RouterProvider,
    // Route,
    Link,
} from "react-router-dom"
import HomePage from "@pages/Home"

const router = createBrowserRouter([
    {
        path: '/',
        element: (<HomePage/>)
    },
    {
        path: 'about',
        element: (
            <div>
                <h1>About Us</h1>
                <Link to="/">Home</Link>
            </div>
        )
    }
])

const PageRouter = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default PageRouter