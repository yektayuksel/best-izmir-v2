/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Layout as ALayout, Menu, Switch, Row, Col } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { BsSun, BsMoon } from 'react-icons/bs';
import { useSession } from 'next-auth/client';
import Footer from './Footer/Footer';
import MENU_CONSTANT from '../../constants/Menu';
import LogoStyles from '../Logo/Logo.module.scss';
import Logo from '../Logo/Logo';
import { toggleTheme } from '../../store/slices/common';
import staticPages from '../../constants/Pages';

const Layout = ({ children }) => {
  const router = useRouter();
  const [session] = useSession();
  const selectedKeys = router.pathname.split('/').map(item => `/${item}`);
  const { Content, Sider } = ALayout;
  const { SubMenu } = Menu;
  const theme = useSelector(state => state.common.theme);
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(true);

  const { t, i18n } = useTranslation('menu');
  const pagesTranslation = useTranslation('pages');

  const toggleLanguage = () => {
    setTimeout(() => {
      router.replace(router.pathname, null, { locale: router.locale === 'tr' ? 'en' : 'tr' });
    }, 200);
  };

  const toggleThemeHandler = () => {
    dispatch(toggleTheme());
  };

  const onCollapse = val => {
    setCollapsed(val);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setCollapsed(true);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  const pageInfo = staticPages.find(info => info.page === router.pathname);

  return (
    <ALayout>
      <Head>
        <title>{`${pagesTranslation.t(pageInfo?.titleKey)} | ${pagesTranslation.t('bestIzmir')}`}</title>
      </Head>
      <Sider className="sidebar" theme={theme} collapsed={collapsed} onCollapse={onCollapse} collapsible>
        <div className={LogoStyles.logo}>
          {!collapsed && <Logo width={225} height={125} isDark={theme === 'dark'} />}
        </div>
        <Row justify="center">
          <Col>
            <Switch
              size="default"
              defaultChecked={i18n.language === 'en'}
              onChange={toggleLanguage}
              unCheckedChildren="TR"
              disabled={session}
              checkedChildren="EN"
            />
          </Col>
        </Row>

        <Menu
          theme={theme}
          defaultSelectedKeys={['1']}
          mode="inline"
          selectedKeys={selectedKeys.length > 1 ? selectedKeys.slice(1) : selectedKeys}
        >
          {MENU_CONSTANT.map(menuItem => {
            if (menuItem.id === '/login' && session) return null;
            if (menuItem.isAdmin && !session?.user?.isAdmin) return null;
            if (menuItem.protected && !session) return null;
            if (menuItem.subMenu) {
              return (
                <SubMenu key={menuItem.id} icon={menuItem.icon} title={t(menuItem.languageKey)}>
                  {menuItem.subMenuComponents.map(item => (
                    <Menu.Item key={item.id} icon={item.icon}>
                      <Link href={menuItem.route + item.route}>
                        <a>{t(item.languageKey)}</a>
                      </Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            }
            return (
              <Menu.Item key={menuItem.id} icon={menuItem.icon}>
                {menuItem.isExternal ? (
                  <a href={menuItem.route}>{t(menuItem.languageKey)}</a>
                ) : (
                  <Link href={menuItem.route}>
                    <a>{t(menuItem.languageKey)}</a>
                  </Link>
                )}
              </Menu.Item>
            );
          })}
        </Menu>
        <Row justify="center">
          <Col>
            <Switch
              size="default"
              defaultChecked={theme === 'dark'}
              onChange={toggleThemeHandler}
              unCheckedChildren={<BsSun />}
              checkedChildren={<BsMoon />}
            />
          </Col>
        </Row>
      </Sider>
      <ALayout className="main-layout">
        {/* <Header /> */}
        <Content>{children}</Content>
        <Footer />
      </ALayout>
    </ALayout>
  );
};

Layout.propTypes = {};

export default Layout;
