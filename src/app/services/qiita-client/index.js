import Config from 'react-native-config';
import QiitaApi from './QiitaApi';
import QiitaAuth from './QiitaAuth';

const BASE_URL = 'https://qiita.com';
const SCOPES = ['read_qiita'];
const { CLIENT_ID, CLIENT_SECRET, SCHEMA } = Config;

const configuration = {
  baseUrl: BASE_URL,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  scopes: SCOPES,
  schema: SCHEMA,
};

const qiitaApi = new QiitaApi(configuration.baseUrl);
const qiitaAuth = new QiitaAuth(configuration);

export { qiitaApi, qiitaAuth };
