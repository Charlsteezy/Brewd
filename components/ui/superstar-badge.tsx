import proBadgeImage from "/public/images/proicons/superstar.gif"
import Image from "next/image"

export function SuperstarBadge () {
    return (
                        <Image
                        src={proBadgeImage}
                        alt="Pro Badge"
                        width={30}
                        height={30}
                        loading="eager"
                        ></Image>
    )

}