import { IHideableElement } from "Common/Types"
import { CardContainer, CardItem } from "./styledComponents"

interface CardProps {
    cardItems?: IHideableElement[]
    onClick?: () => void
}

function ListCard({cardItems, onClick}: CardProps) {
    return(
        <CardContainer onClick={onClick}>
            {cardItems?.map((item, index) => (
                <CardItem 
                    hideOn={item.hideOn} 
                    width={item.width}
                    key={index}
                >
                    {item.element}
                </CardItem>

            ))}
        </CardContainer>
    )
}

export default ListCard