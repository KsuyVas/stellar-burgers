import React, { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <>
            <BurgerIcon type={'primary'} />
            <NavLink
              to='/'
              style={{ textDecoration: 'none' }}
              className={({ isActive }) =>
                `text text_type_main-default ml-2 mr-10 ${
                  isActive ? 'text_color_primary' : 'text_color_inactive'
                }`
              }
            >
              Конструктор
            </NavLink>
          </>
          <>
            <ListIcon type={'primary'} />
            <NavLink
              to='/feed'
              style={{ textDecoration: 'none' }}
              className={({ isActive }) =>
                `text text_type_main-default ml-2 ${
                  isActive ? 'text_color_primary' : 'text_color_inactive'
                }`
              }
            >
              Лента заказов
            </NavLink>
          </>
        </div>
        <div className={styles.logo}>
          <NavLink to='/'>
            <Logo className='' />
          </NavLink>
        </div>
        <div className={styles.link_position_last}>
          <ProfileIcon type={'primary'} />
          <NavLink
            to='/profile'
            style={{ textDecoration: 'none' }}
            className={({ isActive }) => {
              const isProfileActive =
                isActive || location.pathname.startsWith('/profile');
              return `text text_type_main-default ml-2 ${
                isProfileActive ? 'text_color_primary' : 'text_color_inactive'
              }`;
            }}
          >
            {userName || 'Личный кабинет'}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
