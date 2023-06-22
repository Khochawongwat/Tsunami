interface LoadingProps {
    item: string;
  }

const LoadingContainer: React.FC<LoadingProps> = ({item}) => {
    return(
        <div>
            <text>
                Loading {item}...
            </text>
        </div>
    )
}

export default LoadingContainer