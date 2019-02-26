import React, { Component } from 'react';
// import HeaderBrand from './HeaderBrand';
// import HeaderUserControls from './HeaderUserControls';
import Logo from './images/handyman-icon.svg'
import logic from '../../logic'


class NavBar extends Component {
  state={ user:''}

 
  componentDidMount(){
    logic.retrieveUser(logic.sessionId)
          .then(user => {
            this.setState({user})
          })


  }


  handleToggleClick= event =>{
     let toggle = document.querySelector(".nav-toggle")
      let menu = document.querySelector(".navbar-menu")
       
      toggle.classList.toggle("is-active")
       menu.classList.toggle("is-active") 
    }
 
 
  render() {
    return <header>
      <nav className="navbar has-shadow">
        {/* <HeaderBrand /> */}
        <div className="navbar-brand">
          <a className="navbar-item" onClick={this.props.onHomeClick}>
            <img src={Logo} />
          </a>
          <div className="navbar-burger burger nav-toggle" onClick={this.handleToggleClick}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>


        <div className="navbar-menu">
          <div className="navbar-start">
            <div className="navbar-item">
              <small onClick={this.props.onHomeClick}>HandyMan App</small>
            </div>
          </div>


          {/* <HeaderUserControls /> */}
          <div className="navbar-end">
        <div className="navbar-item has-dropdown is-hoverable">
          <div className="navbar-link">
            {this.state.user && this.state.user.name}
          </div>
          <div className="navbar-dropdown">
            <a className="navbar-item">
              <div onClick={this.props.onCreateJobClick}>                                                                                                               
                <span className="icon is-small">
                  <i className="fa fa-user-circle-o"></i>
                </span>
                Create Job
              </div>
            </a>
            <a className="navbar-item">
              <div onClick={this.props.onProfileClick}>
                <span className="icon is-small">
                  <i className="fa "></i>
                </span>
            Profile
              </div>
            </a>
            <a className="navbar-item">
              <div  onClick={this.props.onLogout}>
                <span className="icon is-small">
                  <i className="fa fa-sign-out"></i>
                </span>
                Sign Out
              </div>
            </a>
          </div>
        </div>
      </div>


        </div>
      </nav>
    </header>

  }
}

export default NavBar



// import React, { Component } from 'react'
// import logic from '../../logic'
// import InputForm from './../InputForm'
// import Job from './../Job'
// import CollaboratorModal from './../CollaboratorModal'
// import Logo from './images/handyman-icon.svg'
// import {
//     Collapse,
//     Navbar,
//     NavbarToggler,
//     NavbarBrand,
//     Nav,
//     NavItem,
//     NavLink,
//     UncontrolledDropdown,
//     DropdownToggle,
//     DropdownMenu,
//     DropdownItem } from 'reactstrap';



// function NavBar(props) {


//    return  <div>


//     <Navbar color="light" light expand="md">
//       <NavbarBrand href="/">HandyMan</NavbarBrand>
//         <Nav className="ml-auto" navbar>
//         <NavItem>

//         <object data={Logo} type="image/svg+xml">
//   <img src="yourfallback.jpg" />
// </object>
//         </NavItem>
//         <NavItem>
//             <NavLink href="#" onClick={props.onCreateJobClick}>Create Job</NavLink>
//           </NavItem>
//           <NavItem>
//             <NavLink href="#" onClick={props.onProfileClick}>Profile</NavLink>
//           </NavItem>
//           <NavItem>

//             <NavLink href="#" onClick={props.onLogout}>Logout</NavLink>
//           </NavItem>
//         </Nav>
//     </Navbar>
//   </div>


// }

// export default NavBar