interface IProps {
    text: string;
}

const NoResults = ({ text }: IProps) => {
    return (
        <div className='mt-6 hidden xl:block'>
            NoResult
        </div>
    )
}

export default NoResults;