import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import Image1 from '../../assets/1.png';
import Image2 from '../../assets/3.png';
import Image3 from '../../assets/3.png';
import Image4 from '../../assets/4.png';

const images = [Image1, Image2, Image3, Image4, Image1, Image2, Image3, Image4, Image1, Image2, Image3, Image4];
const imageDisplayDuration = 150;

export default function Loading() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, imageDisplayDuration);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <View>
            <Image
                source={images[currentImageIndex]}
                style={{ width: 500, height: 1000 }}
            />
        </View>
    );
}