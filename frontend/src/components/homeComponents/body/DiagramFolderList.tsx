/*components*/
import DirectoryCard from "../cards/DirectoryCard"
import ModelCard from "../cards/ModelCard"

/*styles*/
import '../../../pages/page.scss'

/*extra*/
import { DirMetadata, ModelMetadata } from "../../../models/model"

/*redux*/
import { useAppSelector } from "../../../store"

type props = {
    directories: Record<number, DirMetadata>,
    models: Record<number, ModelMetadata>
}

const DiagramFolderList = ({ directories, models }: props) => {
    const modelIds = useAppSelector(state => state.dirModel.containedModelIds)

    return (
        <div className='directory-folder-list'>
            {
                directories &&
                Object.values(directories).map((dir: DirMetadata) => (
                    <DirectoryCard key={dir.inode} dirMetadata={dir} />
                ))
            }
            {
                models &&
                modelIds.map((id: number) => (
                    <ModelCard key={id} modelMetadata={models[id]} />
                ))
            }
        </div>
    )
}

export default DiagramFolderList