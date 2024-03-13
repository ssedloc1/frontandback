import React from 'react'
import {Link} from 'react-router-dom'

const NavBar = (props) => {

	return (
            <div className = "navigation" style = {{backgroundColor: "#005A43"}}>
                  <Link to = "/signup">
                        <button className = "navbutton">
                              Create Account
                        </button>
                  </Link>

                  <Link to = "login">
                        <button className = "navbutton">
                              Login
                        </button>
                  </Link>
                  <Link to = "accounts">
                        <button className = "navbutton">
                              View Accounts
                        </button>
                  </Link>

            </div>
	)
}

export default NavBar;
