import addition from '../../assets/Images/Math_icon/addition_purple.png';
import subtraction from '../../assets/Images/Math_icon/minus.png';
import multiplication from '../../assets/Images/Math_icon/multi.png';
import division from '../../assets/Images/Math_icon/division1.png';
import percentage from '../../assets/Images/Math_icon/percentage.png';

/**
 * subjectsData is a dictionary mapping math subjects to their respective icon and color.
 * 
 * Each subject entry includes:
 * - icon: the image used to represent the subject
 * - color: the background or theme color associated with the subject
 */
export const subjectsData = {
    Addition: {
        icon: addition,
        color: '#E0BBE4',   // Light purple
    },
    Subtraction: {
        icon: subtraction,
        color: '#FFABAB',   // Light red/pink
    },
    Multiplication: {
        icon: multiplication,
        color: '#B5EAD7',   // Light green
    },
    Division: {
        icon: division,
        color: '#C7CEEA',   // Light blue
    },
    Percentage: {
        icon: percentage,
        color: '#FFDAC1',   // Light peach
    },
};
