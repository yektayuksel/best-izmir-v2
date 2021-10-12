import '../styles/globals.scss';
import { Provider } from 'react-redux';
import { appWithTranslation } from 'next-i18next';
import { Provider as NProvider } from 'next-auth/client';
import store from '../store/store';
import 'antd/dist/antd.css';
import Layout from '../components/Layout/Layout';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <NProvider session={session}>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </NProvider>
  );
}

export default appWithTranslation(MyApp);
