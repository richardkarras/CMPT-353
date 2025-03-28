// import {AddPosts} from '../AddPosts';
import {Landing} from '../Landing';
import {ShowPosts} from '../ShowPosts';
import {BrowserRouter, Routes, Route, Outlet, Link} from 'react-router-dom';

export default function Router({getAll}) {
    const onlyPosts = [];
    const onlyResponses = [];
    getAll.forEach(element => {
        if(element.type==='post'){
            onlyPosts.push(element);
        }
        if(element.type==='response'){
            onlyResponses.push(element);
        }
    });

    const Layout = () => {
        return (
        <>
            <Outlet />
        </>
        )
    }
    return (
    <BrowserRouter>
        <Link to='/ShowPosts'> <button> Show Posts </button> </Link>
        <Link to='/AddPosts'> <button> Add Post </button> </Link>
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route path='/' element={<Landing/>}/>
                <Route path='ShowPosts' element={<ShowPosts posts={onlyPosts} responses={onlyResponses}/>}/>
                {/* <Route path='AddPosts' element={ <AddPosts setPosts={setPosts}/> }/> */}
            </Route>
        </Routes>
    </BrowserRouter>
  )
}