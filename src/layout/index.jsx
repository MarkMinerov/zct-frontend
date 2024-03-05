import { Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import "./style.scss";

function Layout() {
  const [cookies, removeCookie] = useCookies(['token']);
  const isAuthenticated = cookies.token && cookies.token !== "undefined";

  let NavButtons;

  if (isAuthenticated) {
    NavButtons = <Button colorScheme='red' onClick={() => removeCookie('token')}>Sign Out</Button>
  } else {
    NavButtons = <>
      <Link to="/register">
        <Button colorScheme='teal'>Register</Button>
      </Link>

      <Link to="/login">
        <Button colorScheme='whatsapp'>Login</Button>
      </Link>
    </>
  }


  return (
    <div className='layout'>
      <nav>
        <div className="left">
        <Link to="/">
          <Button colorScheme='blue'>Home</Button>
        </Link>

        {isAuthenticated &&<Link to="/draw"><Button colorScheme='orange'>Draw!</Button></Link>}
        </div>

        <div className="right">
        {NavButtons}
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;