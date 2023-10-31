import Link from 'next/link'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Button from '@material-ui/core/Button'
import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import Collapse from '@material-ui/core/Collapse'

export default function Header(props) {
  const [open, setOpen] = React.useState()

  const handleClick = () => {
    setOpen(!open)
  }

  console.log('Travel' + props.currentTravel)

  return (
    <header className="header">
      <nav className="nav" role="navigation" aria-label="main navigation">
        <Link href="/">
          <Button>
            <h1>{props.siteTitle}</h1>
          </Button>
        </Link>

        <div className="fullScreenMenu">
          <List>
            <ListItem button onClick={handleClick}>
              <ListItemText primary="Reizen" />
              {open ? <ExpandMore /> : <ExpandLess />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {props.travels?.map((travel, i) => {
                  return (
                    <ListItem button selected={props.currentTravel === travel}>
                      <Link key={i} href={'/' + travel}>
                        <ListItemText primary={travel} />
                      </Link>
                    </ListItem>
                  )
                })}
              </List>
            </Collapse>
          </List>
        </div>
      </nav>
      <style jsx>
        {`
          h1 {
            margin-bottom: 0;
          }
          h1:hover {
            cursor: pointer;
          }
          nav {
            padding: 1.5rem 1.25rem;
            border-bottom: 1px solid #ebebeb;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: center;
          }
          .fullScreenMenu {
            width: 100%;
          }
          .listItemPadding {
            padding-left: 10px;
          }
          @media (min-width: 768px) {
            .header {
              height: 100vh;
              position: fixed;
              left: 0;
              top: 0;
            }
            .nav {
              padding: 2rem;
              width: 30vw;
              height: 100%;
              border-right: 1px solid #ebebeb;
              border-bottom: none;
              flex-direction: column;
              align-items: flex-start;
            }
            .fullScreenMenu {
              width: 100%;
            }
          }
        `}
      </style>
    </header>
  )
}
