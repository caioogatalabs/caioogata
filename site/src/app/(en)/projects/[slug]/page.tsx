import { ProjectRoute, projectMetadata, projectStaticParams } from '../../../_site/project'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = projectStaticParams

export function generateMetadata({ params }: Props) {
  return projectMetadata('en', params)
}

export default function ProjectPage({ params }: Props) {
  return <ProjectRoute locale="en" params={params} />
}
