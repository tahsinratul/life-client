import { createBrowserRouter} from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import AllPolicies from "../Pages/AllPolicies/AllPolicies";
import Agents from "../Pages/Agent/Agents";
import FAQ from "../Pages/FAQ/FAQ";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import DashboardLayout from "../Layout/DashboardLayout";
import Forbidden from "../Components/Forbidden";
import PrivateRoute from "./PrivateRoute";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import AdminRoute from "./AdminRoute";
import ManagePolicies from "../Pages/Dashboard/ManagePolicies/ManagePolicies";
import MyPolicies from "../Pages/Dashboard/Customer/MyPolicies";
import SubmitReviews from "../Pages/Dashboard/Customer/SubmitReviews";
import Paymentstatus from "../Pages/Dashboard/Customer/Paymentstatus";
import PaymentPage from "../Pages/Dashboard/Customer/PaymentPage";
import ClaimRequest from "../Pages/Dashboard/Customer/ClaimRequest";
import AgentRoute from "./AgentRoute";
import AssignedCustomer from "../Pages/Dashboard/Agent/AssignedCustomer";
// import ManageBlogs from "../Pages/Dashboard/Agent/ManageBlogs";
import PostBlogs from "../Pages/Dashboard/Agent/PostBlogs";
import PoliciesDetails from "../Pages/Home/PoliciesDetails/PoliciesDetails";
import Quote from "../Pages/Home/Quote";
import ApplyForm from "../Pages/Home/ApplyForm";
import ManageApplication from "../Pages/Dashboard/Admin/ManageApplication";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
import ToBeAgentForm from "../Pages/ToBeAgent/ToBeagent";
import ManageBlogs from "../Pages/Dashboard/Admin/ManageBlogs";
import AgentClaimReview from "../Pages/Dashboard/Agent/AgentClaimReview";
import ManageTransactions from "../Pages/Dashboard/Admin/ManageTransactions";
import DetailsBlogs from "../Pages/Home/DetailsBlogs";
import AllBlogs from "../Pages/AllBlogs/AllBlogs";


 export const router = createBrowserRouter([
  {
  path: "/",
   Component:RootLayout,
   children:[
    {
        index:true,
        Component:Home,
        
    },
    {
        path:'/policies',
        Component:AllPolicies
    },
    {
        path:'/blogs',
        Component:AllBlogs

    },
    {
        path:'/faq',
        Component:FAQ
    },
    {
        path:'/forbidden',
        Component:Forbidden
    },
    {
     path:'blogs/:id',
     Component:DetailsBlogs
    },
    {

      path:'blogs',
      Component:AllBlogs

    },
      {
          path:"/policies/:id",
          element:
            <PoliciesDetails></PoliciesDetails>,
    },{
      path:'/quote/:id',
      element:<PrivateRoute>
        <Quote></Quote>
      </PrivateRoute>
    },
    {
      path:'/to-be-agent',
      element:<PrivateRoute>
        <ToBeAgentForm></ToBeAgentForm>
      </PrivateRoute>

    },
    {
  path: "/apply/:quoteId",
  element: (
    <PrivateRoute>
      <ApplyForm />
    </PrivateRoute>
  )
}

    
   ]
  },
  {
    path:'/',
    Component:AuthLayout,
    children:[

        {
            path:'/login',
            Component:Login
        },
        {
            path:'/register',
            Component:Register
        },
        
        

    ]

  },
  {
    path:'/dashboard',
     element: <PrivateRoute>
        <DashboardLayout></DashboardLayout>
     </PrivateRoute>  ,
    children:[
         {
        index:true,
        Component:DashboardHome
      },
      


      {
        path:'my-policies',
        Component:MyPolicies
      },
      {
        
        path:'my-reviews',
        Component:SubmitReviews

      },
      {
        path:'payment-status',
        Component:Paymentstatus
      },
      {
        path:'payment/:id',
        Component:PaymentPage
      },
      {
        path:'claim-request',
        Component:ClaimRequest
      },


    //   Agent route start >>
    {
        path:'assigned-customers',
        element:<AgentRoute>
            <AssignedCustomer></AssignedCustomer>
        </AgentRoute>
    },
    {
      path:'claim-review',
      element:<AgentRoute>
        <AgentClaimReview></AgentClaimReview>
      </AgentRoute>
    },
    {
        path:"post-blog",
        element:<AgentRoute>
            <PostBlogs></PostBlogs>
        </AgentRoute>
    },


    //   Admin Route is start here

      {

        path:'manage-policies',
        element:<AdminRoute>
            <ManagePolicies></ManagePolicies>
        </AdminRoute>
        
      },
      {
        path:'manage-applications',
        element:<AdminRoute>
          <ManageApplication></ManageApplication>
        </AdminRoute>

      },{
        path:'manage-users',
        element:<AdminRoute>
          <ManageUsers></ManageUsers>
        </AdminRoute>
      },
      {
        path:'manage-blogs',
        element:<AdminRoute>
          <ManageBlogs></ManageBlogs>
        </AdminRoute>

      },
      {
        path:'manage-transactions',
        element:<AdminRoute>
          <ManageTransactions></ManageTransactions>
        </AdminRoute>
      }
    ]

  }

])
