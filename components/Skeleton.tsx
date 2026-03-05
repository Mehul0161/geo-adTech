import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonProps {
    width: number | string;
    height: number | string;
    borderRadius?: number;
    style?: any;
}

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export const Skeleton = ({ width, height, borderRadius = 8, style }: SkeletonProps) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            })
        );
        animation.start();
        return () => animation.stop();
    }, [animatedValue]);

    // Calculate pixel width for animation range
    const pixelWidth = typeof width === 'number' ? width : SCREEN_WIDTH;

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-pixelWidth, pixelWidth],
    });

    return (
        <View
            style={[
                styles.skeleton,
                { width: width as any, height: height as any, borderRadius },
                style,
            ]}
        >
            <AnimatedGradient
                colors={['transparent', 'rgba(255, 255, 255, 0.5)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[
                    StyleSheet.absoluteFill,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#E2E8F0',
        overflow: 'hidden',
    },
});
