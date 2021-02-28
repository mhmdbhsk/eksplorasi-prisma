import ContactCard from 'components/ContactCard';
import ContactForm from 'components/ContactForm';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Contact, PrismaClient, Prisma } from '@prisma/client';
import { useState } from 'react';

const prisma = new PrismaClient();

export async function getServerSideProps() {
  const contacts: Contact[] = await prisma.contact.findMany();

  return {
    props: {
      initialContacts: contacts,
    },
  };
}

async function saveContact(contact: Prisma.ContactCreateInput) {
  const response = await fetch('api/contacts', {
    method: 'POST',
    body: JSON.stringify(contact),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export default function Home({ initialContacts }) {
  const [contact, setContact] = useState<Contact[]>(initialContacts);

  return (
    <div className={styles.container}>
      <Head>
        <title>Contacts App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex w-full">
        <section className="w-1/3 bg-gray-800 h-screen p-8">
          <div className="mb-3">
            <h2 className="text-3xl text-white">Add a Contact</h2>
          </div>
          <ContactForm
            onSubmit={async (data, e) => {
              try {
                await saveContact(data);
                setContact([...contact, data]);
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </section>
        <section className="w-2/3 h-screen p-8">
          <div className="mb-3">
            <h2 className="text-3xl text-gray-700">Contact</h2>
          </div>
          {contact.map((c: Contact, i: number) => (
            <div className="mb-3" key={i}>
              <ContactCard contact={c} />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
