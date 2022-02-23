/* eslint-disable */
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import Image from 'next/image'
import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';


import { useRouter } from 'next/router'
import { api } from '../../services/api';
import { convertDurationToTime } from '../../utills/convertDurationToTimeString';

import styles from './episode.module.scss'

type Episode = {
    id: string;
    title: string;
    members: String;
    published_at: string;
    durationAsString: number;
    duration: number;
    thumbnail: string;
    url: string;
    publishedAt: string;
    description: string;


}
type EpisodeProps = {
    episode: Episode;
}

export default function ({ episode }: EpisodeProps) {
    const router = useRouter();
    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="" alt="Voltar" />
                    </button>
                </Link>
                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button">
                    <img src="" alt="Tocar episódio" />
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }} />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {

    return {
        paths: [
            {
                params: {
                    slug: 'Uma-conversa-sobre-programação-funcional-e-orientação-a-objetos'
                }
            }
        ],
        fallback: 'blocking'
    }
}
export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {

        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTime(Number(data.file.duration)),
        url: data.file.url,
        description: data.description,
    };


    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, //24 hrs

    }
}