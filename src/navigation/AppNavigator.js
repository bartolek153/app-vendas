import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

// Importação das telas (serão criadas em seguida)
import ProductsScreen from '../screens/ProductsScreen';
import ProductFormScreen from '../screens/ProductFormScreen';
import CartScreen from '../screens/CartScreen';
import SalesScreen from '../screens/SalesScreen';
import SaleDetailsScreen from '../screens/SaleDetailsScreen';

const Tab = createBottomTabNavigator();
const ProductsStack = createStackNavigator();
const CartStack = createStackNavigator();
const SalesStack = createStackNavigator();

// Stack Navigator para a seção de Produtos
const ProductsStackNavigator = () => {
  return (
    <ProductsStack.Navigator>
      <ProductsStack.Screen 
        name="ProductsList" 
        component={ProductsScreen} 
        options={{ title: 'Produtos' }}
      />
      <ProductsStack.Screen 
        name="ProductForm" 
        component={ProductFormScreen} 
        options={({ route }) => ({ 
          title: route.params?.product ? 'Editar Produto' : 'Novo Produto' 
        })}
      />
    </ProductsStack.Navigator>
  );
};

// Stack Navigator para a seção de Carrinho
const CartStackNavigator = () => {
  return (
    <CartStack.Navigator>
      <CartStack.Screen 
        name="CartScreen" 
        component={CartScreen} 
        options={{ title: 'Carrinho' }}
      />
    </CartStack.Navigator>
  );
};

// Stack Navigator para a seção de Vendas
const SalesStackNavigator = () => {
  return (
    <SalesStack.Navigator>
      <SalesStack.Screen 
        name="SalesList" 
        component={SalesScreen} 
        options={{ title: 'Histórico de Vendas' }}
      />
      <SalesStack.Screen 
        name="SaleDetails" 
        component={SaleDetailsScreen} 
        options={{ title: 'Detalhes da Venda' }}
      />
    </SalesStack.Navigator>
  );
};

// Bottom Tab Navigator principal
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
          }
        }}
      >
        <Tab.Screen 
          name="Products" 
          component={ProductsStackNavigator} 
          options={{
            headerShown: false,
            tabBarLabel: 'Produtos',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="inventory" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Cart" 
          component={CartStackNavigator} 
          options={{
            headerShown: false,
            tabBarLabel: 'Carrinho',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="shopping-cart" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Sales" 
          component={SalesStackNavigator} 
          options={{
            headerShown: false,
            tabBarLabel: 'Vendas',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="receipt" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
