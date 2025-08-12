import Agenda from 'agenda';

const db = process.env.DATABASE_URL;

const agenda = new Agenda({ db: { address: db } });

export default agenda;
