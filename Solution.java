package Test0813;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class ErrorCount0113 {

    public static int lestCostError(int maxEnergy, int[] charges, int[] costs) {
        for (int cost : costs) {
            if (cost > maxEnergy) {
                return -1;
            }
        }
        int curEnergy = 0;
        int timeCost = 0;
        for (int i = 0; i < charges.length; i++) {
            if (i > 0) {
                curEnergy = curEnergy - costs[i - 1];
            }
            if (curEnergy == sumUp(i, charges.length, costs)) {
                break;
            }
            if (i + 1 == charges.length) {
                timeCost += charges[i] * (costs[i] - curEnergy);
                break;
            }

            if (charges[i] < charges[i + 1]) {
                int nextLow = nextLowIdx(i + 1, charges[i], charges);
                int quantity = Integer.MAX_VALUE;
                if (nextLow == -1) {
                    quantity = maxEnergy;
                } else {
                    quantity = Math.min(maxEnergy, sumUp(i, nextLow, costs));
                }
                timeCost += charges[i] * (quantity - curEnergy);
                curEnergy = quantity;
            } else {
                if (curEnergy < costs[i]) {
                    timeCost += charges[i] * (costs[i] - curEnergy);
                    curEnergy = costs[i];
                }
            }
        }
        return timeCost;
    }

    public static int lestCost(int maxEnergy, int[] charges, int[] costs) {
        for (int cost : costs) {
            if (cost > maxEnergy) {
                return -1;
            }
        }
        int curEnergy = 0;
        int timeCost = 0;
        for (int i = 0; i < charges.length; i++) {
            if (i > 0) {
                curEnergy = curEnergy - costs[i - 1];
            }
            if (curEnergy == sumUp(i, charges.length, costs)) {
                break;
            }
            if (i + 1 == charges.length) {
                timeCost += charges[i] * (costs[i] - curEnergy);
                break;
            }

            if (charges[i] < charges[i + 1]) {
                int nextLow = nextLowIdx(i + 1, charges[i], charges);
                int quantity = Integer.MAX_VALUE;
                if (nextLow == -1) {
                    quantity = Math.min(maxEnergy, sumUp(i, charges.length, costs));
                } else {
                    quantity = Math.min(maxEnergy, sumUp(i, nextLow, costs));
                }
                timeCost += charges[i] * (quantity - curEnergy);
                curEnergy = quantity;
            } else {
                if (curEnergy < costs[i]) {
                    timeCost += charges[i] * (costs[i] - curEnergy);
                    curEnergy = costs[i];
                }
            }
        }
        return timeCost;
    }

    public static int nextLowIdx(int i, int value, int[] costs) {
        for (int j = i; j < costs.length; j++) {
            if (value >= costs[j]) {
                return j;
            }
        }
        return -1;
    }

    public static int sumUp(int i, int end, int[] costs) {
        int sum = 0;
        for (int j = i; j < end; j++) {
            sum += costs[j];
        }
        return sum;
    }

    public static void main(String[] args) {
        SecureRandom ran = new SecureRandom();
        ran.ints(10);
        List<Integer> maxEnergys = new ArrayList<>();
        List<int[]> chargess = new ArrayList<>();
        List<int[]> costss = new ArrayList<>();
        maxEnergys.add(10);
        chargess.add(new int[] { 4, 6, 5, 10, 2 });
        costss.add(new int[] { 4, 5, 2, 3, 1 });

        maxEnergys.add(8);
        chargess.add(new int[] { 4, 6, 5, 10, 2 });
        costss.add(new int[] { 4, 5, 2, 3, 1 });

        maxEnergys.add(8);
        chargess.add(new int[] { 4, 5, 6, 10, 2 });
        costss.add(new int[] { 4, 2, 3, 2, 1 });

        maxEnergys.add(8);
        chargess.add(new int[] { 4, 5, 6, 1, 10 });
        costss.add(new int[] { 4, 2, 3, 2, 1 });

        maxEnergys.add(8);
        chargess.add(new int[] { 4, 5, 6, 1, 2 });
        costss.add(new int[] { 4, 2, 3, 2, 1 });

        maxEnergys.add(8);
        chargess.add(new int[] { 4, 5, 6, 4, 10, 50, 40 });
        costss.add(new int[] { 4, 2, 3, 2, 1, 1, 4, });

        int count = 200;
        ran.ints(count, 1, 100)
                .forEach(i -> maxEnergys.add(i));

        for (int j = 0; j < count; j++) {
            int limit = maxEnergys.get(j);
            int size = ran.nextInt(1, 100);
            int[] charges = new int[size];
            for (int i = 0; i < charges.length; i++) {
                charges[i] = ran.nextInt(1, 100);
            }
            chargess.add(charges);
            int[] costs = new int[size];
            for (int i = 0; i < costs.length; i++) {
                if (limit == 1) {
                    costs[i] = 1;
                    continue;
                }
                costs[i] = ran.nextInt(1, limit);
            }
            costss.add(costs);
        }

        int errorCount = 0;
        for (int i = 0; i < maxEnergys.size(); i++) {
            System.out.println(maxEnergys.get(i));
            System.out.println(Arrays.toString(chargess.get(i)));
            System.out.println(Arrays.toString(costss.get(i)));
            int result1 = lestCost(maxEnergys.get(i), chargess.get(i), costss.get(i));
            int result2 = lestCostError(maxEnergys.get(i), chargess.get(i), costss.get(i));
            System.out.println(result1);
            System.out.println(result2);
            if (result1 != result2) {
                errorCount++;
            }

            System.out.println();
        }
        System.out.println(errorCount + "/" + count);
        System.out.println(((1.0 - (errorCount + 1.0) / count) * 100) + "%");

        /**
         * if (charges[i] < charges[length-1] && Sum(cost[i], cost[length-1]) < maxEnergy 
         *  || )
         * maxEnergy 10
         * charges 4 6 5 10 2
         * costs   1 4 3 2 1 
         * result 4*10 +2*1 = 42
         * 
         * maxEnergy 10
         * charges 4 6 5 10 2
         * costs   1 4 3 2 1 
         * result 4*10 +2*1 = 42
         * 
         * maxEnergy 8
         * charges 4 6 5 10 2
         * costs   4 5 2 3 1 
         * output = result 4*8 + (5 - 4) * 6 + 5 * 5 + + 2*1 = 65
         * 
         * maxEnergy 8
         * charges 4 5 6 10 2
         * costs   4 2 3 2 1 
         * output = 4*8 + 5*3 + 2*1 = 49
         * 
         * maxEnergy 8
         * charges 4 5 6 1 10
         * costs   4 2 3 2 1 
         * output = result = 4*8 + 5*3 + 1*3 = 49
         * 
         * maxEnergy 8
         * charges 4 5 6 1 2
         * costs   4 2 3 2 1 
         * result = 4*8 + 5*1 + 1*3 = 40
         * 
         * maxEnergy 8
         * charges 4 5 6 50 10
         * costs   4 2 3 2 1 
         * result = 4*8 + 5*4 = 52 ✔
         * 
         * maxEnergy 8
         * charges 4 5 6 50 10 20
         * costs   4 2 3 3  7  1
         * result = 4*8 + 5*4 + 6*2 + 10*5 = 114 ✔
         * 
         * maxEnergy 8
         * charges 4 5 6 50 10 20
         * costs   4 2 3 3  6  1
         * result = 4*8 + 5*4 + 6*2 + 10*4 = 104 ✔
         * result = 4*8 + 5*4 + 6*2 + 10*5 = 114 ❌
         * 
         * maxEnergy 8
         * charges 4 5 6 4 10 50 40
         * costs   4 2 3 2 1  1  1
         * result = 4*8 + 5*1 + 4*5 = 57
         * output = 4*8 + 5*1 + 4*8 = 69 ❌
         * 
         * maxEnergy 8
         * charges 4 5 6 4 10 50 40
         * costs   4 2 3 2 1  1  5
         * result = 4*8 + 5*1 + 4*8 + 10*1 = 79
         * output = 4*8 + 5*1 + 4*8 + 10*2 = 89 ❌
         * 
         * maxEnergy 8
         * charges 4 5 6 4 10 50 40
         * costs   4 2 3 2 1  1  4
         * result = 4*8 + 5*1 + 4*8 = 69
         * output = 4*8 + 5*1 + 4*8 = 69 ✔
         * 
         * maxEnergy 8
         * charges 4 5 6 4 10 50 40
         * costs   4 2 3 2 1  1  3
         * result = 4*8 + 5*1 + 4*7 = 65
         * output = 4*8 + 5*1 + 4*8 = 69 ❌
         */
    }
}
